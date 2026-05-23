import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function localKey(userId, weekStart) {
  return `meal-os-shopping-${userId || 'guest'}-${weekStart || 'current'}`
}

export function useShoppingChecks(userId, weekStart) {
  const [checked, setChecked] = useState({})
  const [remoteReady, setRemoteReady] = useState(false)

  const load = useCallback(async () => {
    if (!userId) return
    const local = JSON.parse(localStorage.getItem(localKey(userId, weekStart)) || '{}')
    setChecked(local)
    const { data, error } = await supabase.from('shopping_checks').select('item_key, checked').eq('user_id', userId).eq('week_start', weekStart)
    if (!error) {
      setRemoteReady(true)
      const map = {}
      data.forEach(item => { map[item.item_key] = item.checked })
      setChecked(map)
      localStorage.setItem(localKey(userId, weekStart), JSON.stringify(map))
    }
  }, [userId, weekStart])

  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer) }, [load])

  const toggle = async itemKey => {
    const next = { ...checked, [itemKey]: !checked[itemKey] }
    setChecked(next)
    localStorage.setItem(localKey(userId, weekStart), JSON.stringify(next))
    if (remoteReady && userId) {
      await supabase.from('shopping_checks').upsert({ user_id: userId, week_start: weekStart, item_key: itemKey, checked: next[itemKey] }, { onConflict: 'user_id,week_start,item_key' })
    }
  }

  return { checked, toggle, remoteReady }
}


import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const DEFAULT_GOALS = {
  calorie_goal: 2200,
  protein_goal: 140,
  weekly_budget: 65000,
  preferences: 'High protein, simple meals',
  restrictions: '',
}

function localKey(userId) {
  return `meal-os-goals-${userId || 'guest'}`
}

export function useProfileGoals(userId) {
  const [goals, setGoals] = useState(DEFAULT_GOALS)
  const [loading, setLoading] = useState(true)
  const [remoteReady, setRemoteReady] = useState(false)

  const loadGoals = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const local = JSON.parse(localStorage.getItem(localKey(userId)) || 'null')
    if (local) setGoals({ ...DEFAULT_GOALS, ...local })

    const { data, error } = await supabase.from('user_nutrition_goals').select('*').eq('user_id', userId).maybeSingle()
    if (!error) {
      setRemoteReady(true)
      if (data) {
        const next = { ...DEFAULT_GOALS, ...data }
        setGoals(next)
        localStorage.setItem(localKey(userId), JSON.stringify(next))
      }
    }
    setLoading(false)
  }, [userId])

  useEffect(() => { const timer = setTimeout(loadGoals, 0); return () => clearTimeout(timer) }, [loadGoals])

  const saveGoals = async nextGoals => {
    const normalized = { ...goals, ...nextGoals }
    setGoals(normalized)
    localStorage.setItem(localKey(userId), JSON.stringify(normalized))
    if (remoteReady && userId) {
      await supabase.from('user_nutrition_goals').upsert({ user_id: userId, ...normalized }, { onConflict: 'user_id' })
    }
  }

  return { goals, loading, saveGoals, remoteReady }
}


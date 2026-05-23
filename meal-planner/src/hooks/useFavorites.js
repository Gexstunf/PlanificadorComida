import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function localKey(userId) {
  return `meal-os-favorites-${userId || 'guest'}`
}

export function useFavorites(userId) {
  const [favorites, setFavorites] = useState([])
  const [remoteReady, setRemoteReady] = useState(false)

  const load = useCallback(async () => {
    if (!userId) return
    const fallback = JSON.parse(localStorage.getItem(localKey(userId)) || '[]')
    setFavorites(fallback)

    const { data, error } = await supabase.from('favorite_recipes').select('recipe_id').eq('user_id', userId)
    if (!error) {
      setRemoteReady(true)
      const ids = data.map(item => item.recipe_id)
      setFavorites(ids)
      localStorage.setItem(localKey(userId), JSON.stringify(ids))
    }
  }, [userId])

  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer) }, [load])

  const toggleFavorite = async recipeId => {
    const next = favorites.includes(recipeId) ? favorites.filter(id => id !== recipeId) : [...favorites, recipeId]
    setFavorites(next)
    localStorage.setItem(localKey(userId), JSON.stringify(next))

    if (!remoteReady || !userId) return
    if (favorites.includes(recipeId)) {
      await supabase.from('favorite_recipes').delete().eq('user_id', userId).eq('recipe_id', recipeId)
    } else {
      await supabase.from('favorite_recipes').upsert({ user_id: userId, recipe_id: recipeId }, { onConflict: 'user_id,recipe_id' })
    }
  }

  return { favorites, toggleFavorite, remoteReady }
}


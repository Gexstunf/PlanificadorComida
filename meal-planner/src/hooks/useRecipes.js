import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const nutritionFields = ['calories', 'protein_g', 'carbs_g', 'fat_g', 'prep_time_min', 'difficulty']
const nutritionError = message => nutritionFields.some(field => message?.includes(field))

function recipePayload(data, userId) {
  const payload = {
    name: data.name,
    instructions: data.instructions,
    image_url: data.image_url,
  }
  nutritionFields.forEach(field => {
    if (data[field] !== undefined && data[field] !== '') payload[field] = data[field] || null
  })
  if (userId) payload.user_id = userId
  return payload
}

export function useRecipes(userId) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRecipes = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('recipes')
      .select(`*, recipe_ingredients (*)`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setRecipes(data)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    const timer = setTimeout(fetchRecipes, 0)
    return () => clearTimeout(timer)
  }, [fetchRecipes])

  const insertRecipe = async payload => supabase.from('recipes').insert(payload).select().single()
  const updateRecipeRow = async (recipeId, payload) => supabase.from('recipes').update(payload).eq('id', recipeId)

  const createRecipe = async formData => {
    let { data: recipe, error: recipeError } = await insertRecipe(recipePayload(formData, userId))

    if (recipeError && nutritionError(recipeError.message)) {
      const minimal = recipePayload(formData, userId)
      nutritionFields.forEach(field => delete minimal[field])
      const retry = await insertRecipe(minimal)
      recipe = retry.data
      recipeError = retry.error
    }

    if (recipeError) throw new Error(recipeError.message)

    if (formData.ingredients?.length > 0) {
      const rows = formData.ingredients.map(ing => ({ recipe_id: recipe.id, name: ing.name, quantity: ing.quantity, unit: ing.unit }))
      const { error: ingError } = await supabase.from('recipe_ingredients').insert(rows)
      if (ingError) throw new Error(ingError.message)
    }

    await fetchRecipes()
    return recipe
  }

  const updateRecipe = async (recipeId, formData) => {
    let { error: recipeError } = await updateRecipeRow(recipeId, recipePayload(formData))

    if (recipeError && nutritionError(recipeError.message)) {
      const minimal = recipePayload(formData)
      nutritionFields.forEach(field => delete minimal[field])
      const retry = await updateRecipeRow(recipeId, minimal)
      recipeError = retry.error
    }

    if (recipeError) throw new Error(recipeError.message)

    await supabase.from('recipe_ingredients').delete().eq('recipe_id', recipeId)

    if (formData.ingredients?.length > 0) {
      const rows = formData.ingredients.map(ing => ({ recipe_id: recipeId, name: ing.name, quantity: ing.quantity, unit: ing.unit }))
      const { error: ingError } = await supabase.from('recipe_ingredients').insert(rows)
      if (ingError) throw new Error(ingError.message)
    }

    await fetchRecipes()
  }

  const deleteRecipe = async recipeId => {
    const { error } = await supabase.from('recipes').delete().eq('id', recipeId)
    if (error) throw new Error(error.message)
    await fetchRecipes()
  }

  return { recipes, loading, error, createRecipe, updateRecipe, deleteRecipe, refetch: fetchRecipes }
}

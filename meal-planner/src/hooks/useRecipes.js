import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useRecipes(userId) {
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // fetch
    const fetchRecipes = useCallback(async () => {
        if (!userId) return
        setLoading(true)
        const { data, error } = await supabase
            .from('recipes')
            .select(`
                *,
                recipe_ingredients (*)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) setError(error.message)
        else setRecipes(data)
        setLoading(false)

    }, [userId])

    useEffect(() => { fetchRecipes() }, [fetchRecipes])

    // create
    const createRecipe = async ({ name, instructions, ingredients }) => {
        const { data: recipe, error: recipeError } = await supabase
            .from('recipes')
            .insert({ name, instructions, user_id: userId })
            .select()
            .single()

        if (recipeError) throw new Error(recipeError.message)

        if (ingredients?.length > 0) {
            const rows = ingredients.map(ing => ({
                recipe_id: recipe.id,
                name: ing.name,
                quantity: ing.quantity,
                unit: ing.unit,
        }))

        const { error: ingError } = await supabase
            .from('recipe_ingredients')
            .insert(rows)

        if (ingError) throw new Error(ingError.message)
        }

        await fetchRecipes()
        return recipe
    }

    // update 
    const updateRecipe = async (recipeId, { name, instructions, ingredients }) => {
        const { error: recipeError } = await supabase
            .from('recipes')
            .update({ name, instructions })
            .eq('id', recipeId)

        if (recipeError) throw new Error(recipeError.message)

        await supabase.from('recipe_ingredients').delete().eq('recipe_id', recipeId)

        if (ingredients?.length > 0) {
            const rows = ingredients.map(ing => ({
                recipe_id: recipeId,
                name: ing.name,
                quantity: ing.quantity,
                unit: ing.unit,
        }))
        
        const { error: ingError } = await supabase
            .from('recipe_ingredients')
            .insert(rows)

        if (ingError) throw new Error(ingError.message)
        }

        await fetchRecipes()
    }

    // delete
    const deleteRecipe = async (recipeId) => {
        const { error } = await supabase
            .from('recipes')
            .delete()
            .eq('id', recipeId)
        if (error) throw new Error(error.message)

        await fetchRecipes()
        }

        return { recipes, loading, error, createRecipe, updateRecipe, deleteRecipe, refetch: fetchRecipes }
}
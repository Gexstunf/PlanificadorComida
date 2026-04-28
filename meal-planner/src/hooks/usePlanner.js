import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

function getWeekStart() {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(now.setDate(diff))
    return monday.toISOString().split('T')[0]
}

export function usePlanner(userId) {
    const [planId, setPlanId] = useState(null)
    const [entries, setEntries] = useState({})
    const [loading, setLoading] = useState(true)
    const weekStart = getWeekStart()

    const fetchPlan = useCallback(async () => {
        if (!userId) return
        setLoading(true)

    let { data: plan } = await supabase
        .from('meal_plans')
        .select('id')
        .eq('user_id', userId)
        .eq('week_start', weekStart)
        .maybeSingle()

    if (!plan) {
        const { data: newPlan } = await supabase
            .from('meal_plans')
            .insert({ user_id: userId, week_start: weekStart })
            .select()
            .single()
        plan = newPlan
    }

    setPlanId(plan.id)

    const { data: planEntries } = await supabase
        .from('meal_plan_entries')
        .select('*')
        .eq('meal_plan_id', plan.id)

    const map = {}
    planEntries?.forEach(e => {
        map[`${e.day_of_week}-${e.meal_type}`] = e.recipe_id
    })

    setEntries(map)
    setLoading(false)

    }, [userId, weekStart])

    useEffect(() => { fetchPlan() }, [fetchPlan])

    const setEntry = async (dayOfWeek, mealType, recipeId) => {
        const key = `${dayOfWeek}-${mealType}`

        setEntries(prev => ({ ...prev, [key]: recipeId }))

        await supabase
            .from('meal_plan_entries')
            .upsert(
            { meal_plan_id: planId, day_of_week: dayOfWeek, meal_type: mealType, recipe_id: recipeId },
            { onConflict: 'meal_plan_id,day_of_week,meal_type' }
        )
    }

    return { entries, loading, setEntry, planId }
}
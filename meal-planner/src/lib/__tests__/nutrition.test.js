import { describe, expect, it } from 'vitest'
import { buildPlannerAnalytics, estimateRecipeNutrition, filterRecipes, getRecipeMeta } from '../nutrition'

const recipes = [
  { id: 'tracked', name: 'Tracked Bowl', calories: 520, protein_g: 42, carbs_g: 55, fat_g: 14, prep_time_min: 18, recipe_ingredients: [] },
  { id: 'veg', name: 'Tomato Rice', recipe_ingredients: [{ name: 'Tomato', quantity: 2, unit: 'unit' }, { name: 'Rice', quantity: 1, unit: 'cup' }] },
]

describe('nutrition utilities', () => {
  it('uses real nutrition fields when provided', () => {
    expect(estimateRecipeNutrition(recipes[0])).toMatchObject({ calories: 520, protein: 42, source: 'tracked' })
  })

  it('estimates nutrition when real fields are missing', () => {
    expect(estimateRecipeNutrition(recipes[1]).calories).toBeGreaterThan(120)
  })

  it('builds weekly averages from planner entries', () => {
    const analytics = buildPlannerAnalytics(recipes, { '0-lunch': 'tracked', '1-dinner': 'tracked' }, { protein_goal: 120 })
    expect(analytics.plannedCount).toBe(2)
    expect(analytics.averages.protein).toBe(12)
  })

  it('filters high protein recipes', () => {
    expect(filterRecipes(recipes, '', 'highProtein', []).map(recipe => recipe.id)).toEqual(['tracked'])
  })

  it('marks recipe metadata as tracked', () => {
    expect(getRecipeMeta(recipes[0]).tags).toContain('Tracked')
  })
})

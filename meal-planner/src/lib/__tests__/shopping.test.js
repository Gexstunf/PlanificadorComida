import { describe, expect, it } from 'vitest'
import { buildShoppingItems, categorizeIngredient, groupShoppingItems } from '../shopping'

const recipes = [
  { id: 'r1', recipe_ingredients: [{ name: 'Chicken breast', quantity: 2, unit: 'kg' }, { name: 'Rice', quantity: 1, unit: 'kg' }] },
  { id: 'r2', recipe_ingredients: [{ name: 'chicken breast', quantity: 1, unit: 'kg' }, { name: 'Tomato', quantity: 4, unit: 'unit' }] },
]

describe('shopping utilities', () => {
  it('categorizes ingredients', () => {
    expect(categorizeIngredient('Chicken breast')).toBe('Proteins')
    expect(categorizeIngredient('Tomato')).toBe('Vegetables')
  })

  it('merges duplicate ingredients by name and unit', () => {
    const items = buildShoppingItems(recipes, { '0-lunch': 'r1', '1-dinner': 'r2' })
    const chicken = items.find(item => item.name.toLowerCase() === 'chicken breast')
    expect(chicken.quantity).toBe(3)
  })

  it('groups shopping items by category', () => {
    const groups = groupShoppingItems(buildShoppingItems(recipes, { '0-lunch': 'r1' }))
    expect(groups.Proteins).toHaveLength(1)
    expect(groups.Grains).toHaveLength(1)
  })
})

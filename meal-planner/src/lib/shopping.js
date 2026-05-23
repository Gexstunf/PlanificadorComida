const CATEGORY_RULES = [
  ['Vegetables', ['tomate', 'tomato', 'lechuga', 'lettuce', 'zanahoria', 'carrot', 'cebolla', 'onion', 'brocoli', 'pepper', 'spinach', 'ajo']],
  ['Proteins', ['pollo', 'chicken', 'carne', 'beef', 'pescado', 'fish', 'huevo', 'egg', 'tofu', 'atun', 'salmon']],
  ['Dairy', ['leche', 'milk', 'queso', 'cheese', 'yogurt', 'cream', 'manteca', 'butter']],
  ['Grains', ['arroz', 'rice', 'pasta', 'pan', 'bread', 'avena', 'oats', 'quinoa', 'harina', 'flour']],
  ['Pantry', ['aceite', 'oil', 'sal', 'salt', 'azucar', 'sugar', 'salsa', 'sauce', 'spice', 'pimienta']],
  ['Fruit', ['banana', 'manzana', 'apple', 'limon', 'lemon', 'naranja', 'orange', 'berries']],
]

export function categorizeIngredient(name = '') {
  const normalized = name.toLowerCase()
  const match = CATEGORY_RULES.find(([, words]) => words.some(word => normalized.includes(word)))
  return match?.[0] || 'Other'
}

export function buildShoppingItems(recipes, entries) {
  const recipeIds = Object.values(entries || {}).filter(Boolean)
  const map = {}

  recipeIds.forEach(recipeId => {
    const recipe = recipes.find(item => item.id === recipeId)
    recipe?.recipe_ingredients?.forEach(ingredient => {
      const unit = ingredient.unit || 'unit'
      const key = `${ingredient.name?.toLowerCase()}|${unit}`
      const quantity = Number(ingredient.quantity) || 1
      map[key] = map[key]
        ? { ...map[key], quantity: map[key].quantity + quantity }
        : { key, name: ingredient.name, unit, quantity, category: categorizeIngredient(ingredient.name) }
    })
  })

  return Object.values(map).sort((a, b) => `${a.category}${a.name}`.localeCompare(`${b.category}${b.name}`))
}

export function groupShoppingItems(items) {
  return items.reduce((groups, item) => {
    groups[item.category] = [...(groups[item.category] || []), item]
    return groups
  }, {})
}

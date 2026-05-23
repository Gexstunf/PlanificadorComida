const PROTEIN_WORDS = ['pollo', 'chicken', 'carne', 'beef', 'pescado', 'fish', 'huevo', 'egg', 'tofu', 'atun', 'salmon', 'yogurt']
const CARB_WORDS = ['arroz', 'rice', 'pasta', 'pan', 'bread', 'avena', 'oats', 'papa', 'potato', 'quinoa', 'noodle']
const FAT_WORDS = ['aceite', 'oil', 'palta', 'avocado', 'nuez', 'nut', 'queso', 'cheese', 'manteca', 'butter']
const VEG_WORDS = ['tomate', 'tomato', 'lechuga', 'lettuce', 'zanahoria', 'carrot', 'cebolla', 'onion', 'brocoli', 'pepper', 'spinach']

function includesAny(text, words) {
  return words.some(word => text.includes(word))
}

function numberOrNull(value) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : null
}

export function estimateRecipeNutrition(recipe) {
  const explicit = {
    calories: numberOrNull(recipe?.calories),
    protein: numberOrNull(recipe?.protein_g),
    carbs: numberOrNull(recipe?.carbs_g),
    fat: numberOrNull(recipe?.fat_g),
  }

  if (explicit.calories || explicit.protein || explicit.carbs || explicit.fat) {
    return {
      calories: explicit.calories || 0,
      protein: explicit.protein || 0,
      carbs: explicit.carbs || 0,
      fat: explicit.fat || 0,
      source: 'tracked',
    }
  }

  const ingredients = recipe?.recipe_ingredients || []
  const name = recipe?.name?.toLowerCase() || ''
  let calories = 240
  let protein = 14
  let carbs = 24
  let fat = 9

  ingredients.forEach(ingredient => {
    const text = `${ingredient.name || ''} ${ingredient.unit || ''}`.toLowerCase()
    const quantity = Number(ingredient.quantity) || 1
    const factor = Math.min(Math.max(quantity, 1), 6)

    if (includesAny(text, PROTEIN_WORDS)) {
      calories += 78 * factor
      protein += 9 * factor
      fat += 2 * factor
    } else if (includesAny(text, CARB_WORDS)) {
      calories += 62 * factor
      carbs += 12 * factor
    } else if (includesAny(text, FAT_WORDS)) {
      calories += 85 * factor
      fat += 8 * factor
    } else if (includesAny(text, VEG_WORDS)) {
      calories += 18 * factor
      carbs += 3 * factor
    } else {
      calories += 26 * factor
      carbs += 3 * factor
      protein += 1 * factor
    }
  })

  if (name.includes('salad') || name.includes('ensalada')) calories -= 80
  if (name.includes('protein') || name.includes('proteina')) protein += 18

  return {
    calories: Math.max(120, Math.round(calories)),
    protein: Math.max(6, Math.round(protein)),
    carbs: Math.max(8, Math.round(carbs)),
    fat: Math.max(3, Math.round(fat)),
    source: 'estimated',
  }
}

export function buildPlannerAnalytics(recipes, entries, goals = {}) {
  const plannedRecipes = Object.values(entries || {})
    .filter(Boolean)
    .map(recipeId => recipes.find(recipe => recipe.id === recipeId))
    .filter(Boolean)

  const totals = plannedRecipes.reduce((acc, recipe) => {
    const nutrition = estimateRecipeNutrition(recipe)
    return {
      calories: acc.calories + nutrition.calories,
      protein: acc.protein + nutrition.protein,
      carbs: acc.carbs + nutrition.carbs,
      fat: acc.fat + nutrition.fat,
    }
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 })

  const days = Array.from({ length: 7 }, (_, dayIndex) => {
    const recipeIds = ['breakfast', 'lunch', 'dinner'].map(meal => entries?.[`${dayIndex}-${meal}`]).filter(Boolean)
    return recipeIds.reduce((acc, recipeId) => {
      const recipe = recipes.find(item => item.id === recipeId)
      if (!recipe) return acc
      const nutrition = estimateRecipeNutrition(recipe)
      return {
        calories: acc.calories + nutrition.calories,
        protein: acc.protein + nutrition.protein,
        carbs: acc.carbs + nutrition.carbs,
        fat: acc.fat + nutrition.fat,
      }
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
  })

  const averages = {
    calories: Math.round(totals.calories / 7),
    protein: Math.round(totals.protein / 7),
    carbs: Math.round(totals.carbs / 7),
    fat: Math.round(totals.fat / 7),
  }

  return {
    plannedCount: plannedRecipes.length,
    totals,
    averages,
    days,
    goalProgress: {
      calories: goals.calorie_goal ? Math.round((averages.calories / goals.calorie_goal) * 100) : 0,
      protein: goals.protein_goal ? Math.round((averages.protein / goals.protein_goal) * 100) : 0,
    },
  }
}

export function getRecipeMeta(recipe) {
  const nutrition = estimateRecipeNutrition(recipe)
  const ingredients = recipe?.recipe_ingredients || []
  const text = `${recipe?.name || ''} ${recipe?.instructions || ''} ${ingredients.map(item => item.name).join(' ')}`.toLowerCase()
  const prepTime = numberOrNull(recipe?.prep_time_min) || Math.min(55, Math.max(12, 10 + ingredients.length * 4))
  const tags = []

  if (!includesAny(text, PROTEIN_WORDS)) tags.push('Vegetarian')
  if (!text.includes('queso') && !text.includes('cheese') && !text.includes('milk') && !text.includes('yogurt')) tags.push('Dairy light')
  if (prepTime <= 25) tags.push('Quick')
  if (nutrition.protein >= 30) tags.push('High protein')
  if (nutrition.calories <= 520) tags.push('Lean')
  if (nutrition.source === 'tracked') tags.unshift('Tracked')

  return {
    ...nutrition,
    prepTime,
    tags: tags.slice(0, 3),
    difficulty: recipe?.difficulty || (ingredients.length > 8 ? 'Advanced' : ingredients.length > 4 ? 'Medium' : 'Easy'),
    isCheap: ingredients.length <= 6,
    isQuick: prepTime <= 25,
    isVegetarian: !includesAny(text, PROTEIN_WORDS.filter(word => !['tofu', 'yogurt'].includes(word))),
  }
}

export function filterRecipes(recipes, query = '', activeFilter = 'all', favorites = []) {
  return recipes.filter(recipe => {
    const meta = getRecipeMeta(recipe)
    const matchesQuery = recipe.name?.toLowerCase().includes(query.toLowerCase())
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'highProtein' && meta.protein >= 30) ||
      (activeFilter === 'vegetarian' && meta.isVegetarian) ||
      (activeFilter === 'quick' && meta.isQuick) ||
      (activeFilter === 'cheap' && meta.isCheap) ||
      (activeFilter === 'favorites' && favorites.includes(recipe.id))
    return matchesQuery && matchesFilter
  })
}


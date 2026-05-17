import { useState } from 'react'

const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php'

function mapMealToRecipe(meal) {
  const ingredients = []

  for (let i = 1; i <= 20; i += 1) {
    const name = meal[`strIngredient${i}`]?.trim()
    const measure = meal[`strMeasure${i}`]?.trim()

    if (name) {
      ingredients.push({
        name,
        quantity: '1',
        unit: measure || 'unidad',
      })
    }
  }

  return {
    id: meal.idMeal,
    name: meal.strMeal,
    category: meal.strCategory,
    area: meal.strArea,
    instructions: meal.strInstructions || '',
    image_url: meal.strMealThumb || null,
    ingredients,
  }
}

export function useMealSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchMeals = async (event) => {
    event?.preventDefault()
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setResults([])
      setError('Escribí el nombre de una comida para buscar.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}?s=${encodeURIComponent(trimmedQuery)}`)
      if (!response.ok) throw new Error('No se pudo conectar con la API de recetas.')

      const data = await response.json()
      const meals = data.meals || []
      setResults(meals.map(mapMealToRecipe))

      if (meals.length === 0) {
        setError('No encontramos recetas con ese nombre. Probá con pasta, chicken o beef.')
      }
    } catch (err) {
      setError(err.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return { query, setQuery, results, loading, error, searchMeals }
}

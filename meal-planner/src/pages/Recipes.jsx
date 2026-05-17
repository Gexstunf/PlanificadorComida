import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useRecipes } from '../hooks/useRecipes'
import { useMealSearch } from '../hooks/useMealSearch'
import RecipeForm from '../components/recipes/RecipeForm'
import RecipeCard from '../components/recipes/RecipeCard'

export default function Recipes() {
  const { user } = useAuth()
  const { recipes, loading, error, createRecipe, updateRecipe, deleteRecipe } = useRecipes(user?.id)
  const mealSearch = useMealSearch()

  const [showForm, setShowForm] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [importingId, setImportingId] = useState(null)

  const handleSubmit = async (formData) => {
    try {
      if (editingRecipe) {
        await updateRecipe(editingRecipe.id, formData)
      } else {
        await createRecipe(formData)
      }
      setShowForm(false)
      setEditingRecipe(null)
    } catch (e) {
      alert('Error: ' + e.message)
    }
  }

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar receta?')) return
    try {
      await deleteRecipe(id)
    } catch (e) {
      alert('Error: ' + e.message)
    }
  }

  const handleImport = async (recipe) => {
    setImportingId(recipe.id)
    try {
      await createRecipe(recipe)
    } catch (e) {
      alert('Error: ' + e.message)
    } finally {
      setImportingId(null)
    }
  }

  if (loading) return <p className="loading-copy">Cargando recetas...</p>
  if (error) return <p className="inline-message inline-message--error">Error: {error}</p>

  return (
    <div className="recipes-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Recetario personal</p>
          <h1>Mis recetas</h1>
          <p>Guardá tus comidas favoritas, importá ideas y usalas en el planificador semanal.</p>
        </div>
        <button className="btn btn--primary" onClick={() => { setEditingRecipe(null); setShowForm(true) }}>
          Nueva receta
        </button>
      </div>

      {showForm && (
        <RecipeForm
          initialData={editingRecipe}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditingRecipe(null) }}
        />
      )}

      <section className="recipe-search-panel">
        <div className="recipe-search-panel__copy">
          <p className="eyebrow">Inspiración rápida</p>
          <h2>Buscar recetas online</h2>
          <p>Encontrá comidas reales por nombre e importalas con ingredientes e imagen.</p>
        </div>
        <form className="recipe-search" onSubmit={mealSearch.searchMeals}>
          <input
            value={mealSearch.query}
            onChange={e => mealSearch.setQuery(e.target.value)}
            placeholder="Ej: pasta, chicken, beef..."
          />
          <button className="btn btn--secondary" type="submit" disabled={mealSearch.loading}>
            {mealSearch.loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {mealSearch.error && <p className="inline-message">{mealSearch.error}</p>}

        {mealSearch.results.length > 0 && (
          <div className="external-recipes">
            {mealSearch.results.slice(0, 6).map(recipe => (
              <article className="external-recipe" key={recipe.id}>
                {recipe.image_url && <img src={recipe.image_url} alt={recipe.name} />}
                <div>
                  <span>{recipe.category || 'Receta'} · {recipe.area || 'Internacional'}</span>
                  <h3>{recipe.name}</h3>
                  <button
                    className="btn btn--primary btn--sm"
                    onClick={() => handleImport(recipe)}
                    disabled={importingId === recipe.id}
                  >
                    {importingId === recipe.id ? 'Importando...' : 'Importar'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {recipes.length === 0 ? (
        <div className="empty-state">
          <h2>Todavía no tenés recetas</h2>
          <p>Creá una receta propia o buscá una comida online para importarla.</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onEdit={() => handleEdit(recipe)}
              onDelete={() => handleDelete(recipe.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useRecipes } from '../hooks/useRecipes'
import { useMealSearch } from '../hooks/useMealSearch'
import { useFavorites } from '../hooks/useFavorites'
import RecipeForm from '../components/recipes/RecipeForm'
import RecipeCard from '../components/recipes/RecipeCard'
import Icon from '../components/ui/Icon'
import Skeleton from '../components/ui/Skeleton'
import { filterRecipes } from '../lib/nutrition'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'highProtein', label: 'High protein' },
  { key: 'vegetarian', label: 'Vegetarian' },
  { key: 'quick', label: 'Quick' },
  { key: 'cheap', label: 'Cheap' },
  { key: 'favorites', label: 'Favorites' },
]

export default function Recipes() {
  const { user } = useAuth()
  const { recipes, loading, error, createRecipe, updateRecipe, deleteRecipe } = useRecipes(user?.id)
  const { favorites, toggleFavorite, remoteReady } = useFavorites(user?.id)
  const mealSearch = useMealSearch()
  const [showForm, setShowForm] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [importingId, setImportingId] = useState(null)
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredRecipes = useMemo(() => filterRecipes(recipes, query, activeFilter, favorites), [recipes, query, activeFilter, favorites])

  const handleSubmit = async formData => {
    if (editingRecipe) await updateRecipe(editingRecipe.id, formData)
    else await createRecipe(formData)
    setShowForm(false)
    setEditingRecipe(null)
  }

  const handleImport = async recipe => {
    setImportingId(recipe.id)
    try { await createRecipe(recipe) } finally { setImportingId(null) }
  }

  if (error) return <p className="inline-message inline-message--error">Error: {error}</p>

  return (
    <div className="recipes-page page-fade">
      <section className="page-header-card">
        <div><p className="eyebrow">Recipe operating system</p><h2>Premium meal library</h2><p>Search, filter, favorite, import, and keep recipes ready for fast weekly planning. {remoteReady ? 'Favorites sync with Supabase.' : 'Favorites are local until migration is applied.'}</p></div>
        <button className="btn btn--primary" onClick={() => { setEditingRecipe(null); setShowForm(true) }}><Icon name="plus" /> New recipe</button>
      </section>

      {showForm && <RecipeForm initialData={editingRecipe} onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditingRecipe(null) }} />}

      <section className="filters-panel">
        <div className="search-control"><Icon name="search" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search recipes, tags, macros..." /></div>
        <div className="filter-chips">{FILTERS.map(filter => <button key={filter.key} className={activeFilter === filter.key ? 'active' : ''} onClick={() => setActiveFilter(filter.key)}>{filter.label}</button>)}</div>
      </section>

      <section className="recipe-search-panel panel">
        <div className="panel__header"><div><p className="eyebrow">Inspiration</p><h3>Online recipe import</h3></div></div>
        <form className="recipe-search" onSubmit={mealSearch.searchMeals}>
          <input value={mealSearch.query} onChange={event => mealSearch.setQuery(event.target.value)} placeholder="Try chicken, pasta, beef..." />
          <button className="btn btn--secondary" type="submit" disabled={mealSearch.loading}>{mealSearch.loading ? 'Searching...' : 'Search'}</button>
        </form>
        {mealSearch.results.length > 0 && <div className="external-recipes">{mealSearch.results.slice(0, 6).map(recipe => <article className="external-recipe" key={recipe.id}>{recipe.image_url && <img src={recipe.image_url} alt="" />}<div><span>{recipe.category || 'Recipe'} · {recipe.area || 'Global'}</span><h3>{recipe.name}</h3><button className="btn btn--primary btn--sm" onClick={() => handleImport(recipe)} disabled={importingId === recipe.id}>{importingId === recipe.id ? 'Importing...' : 'Import'}</button></div></article>)}</div>}
      </section>

      {loading ? <div className="recipes-grid">{[0, 1, 2, 3, 4, 5].map(item => <Skeleton key={item} className="recipe-card-skeleton" />)}</div> : filteredRecipes.length === 0 ? <div className="empty-state"><h2>No recipes match this view</h2><p>Create one, import online, or adjust filters.</p></div> : <div className="recipes-grid">{filteredRecipes.map((recipe, index) => <motion.div key={recipe.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}><RecipeCard recipe={recipe} favorite={favorites.includes(recipe.id)} onFavorite={() => toggleFavorite(recipe.id)} onEdit={() => { setEditingRecipe(recipe); setShowForm(true) }} onDelete={() => deleteRecipe(recipe.id)} /></motion.div>)}</div>}
    </div>
  )
}

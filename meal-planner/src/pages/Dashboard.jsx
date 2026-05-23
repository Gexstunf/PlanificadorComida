import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useRecipes } from '../hooks/useRecipes'
import { usePlanner } from '../hooks/usePlanner'
import { useProfileGoals } from '../hooks/useProfileGoals'
import { buildPlannerAnalytics, getRecipeMeta } from '../lib/nutrition'
import { buildShoppingItems } from '../lib/shopping'
import MacroRing from '../components/ui/MacroRing'
import Icon from '../components/ui/Icon'
import Skeleton from '../components/ui/Skeleton'

export default function Dashboard() {
  const { user } = useAuth()
  const { recipes, loading } = useRecipes(user?.id)
  const { entries } = usePlanner(user?.id)
  const { goals } = useProfileGoals(user?.id)

  const analytics = useMemo(() => buildPlannerAnalytics(recipes, entries, goals), [recipes, entries, goals])
  const shoppingItems = useMemo(() => buildShoppingItems(recipes, entries), [recipes, entries])
  const recentRecipes = recipes.slice(0, 4)
  const upcomingMeals = Object.values(entries).filter(Boolean).slice(0, 5).map(id => recipes.find(recipe => recipe.id === id)).filter(Boolean)

  return (
    <div className="dashboard page-fade">
      <motion.section className="hero-panel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div>
          <p className="eyebrow">Command center</p>
          <h2>Plan the week with nutrition-grade clarity.</h2>
          <p>Drag meals, track macro balance, generate smart shopping lists, and keep the whole week visible without friction.</p>
        </div>
        <div className="hero-panel__actions">
          <Link className="btn btn--primary" to="/planner"><Icon name="plus" /> Quick-add meal</Link>
          <Link className="btn btn--ghost" to="/recipes"><Icon name="recipes" /> Manage recipes</Link>
        </div>
      </motion.section>

      <section className="stats-grid">
        {loading ? [0, 1, 2, 3].map(item => <Skeleton key={item} className="stat-card" />) : <>
          <article className="stat-card"><span>Planned meals</span><strong>{analytics.plannedCount}/21</strong><div className="meter"><span style={{ width: `${Math.round((analytics.plannedCount / 21) * 100)}%` }} /></div></article>
          <article className="stat-card"><span>Avg calories</span><strong>{analytics.averages.calories}</strong><small>daily kcal</small></article>
          <article className="stat-card"><span>Protein</span><strong>{analytics.averages.protein}g</strong><small>{analytics.goalProgress.protein || 0}% of goal</small></article>
          <article className="stat-card"><span>Shopping</span><strong>{shoppingItems.length}</strong><small>merged items</small></article>
        </>}
      </section>

      <section className="dashboard-grid dashboard-grid--clean">
        <article className="panel panel--large">
          <div className="panel__header"><div><p className="eyebrow">Nutrition</p><h3>Macro distribution</h3></div><span className="panel__badge">Cronometer inspired</span></div>
          <div className="macro-row"><MacroRing value={Math.min(100, Math.round((analytics.averages.protein / (goals.protein_goal || 120)) * 100))} label="Protein" /><MacroRing value={Math.min(100, Math.round((analytics.averages.carbs / 260) * 100))} label="Carbs" tone="cyan" /><MacroRing value={Math.min(100, Math.round((analytics.averages.fat / 80) * 100))} label="Fats" tone="white" /></div>
          <div className="week-bars">{analytics.days.map((day, index) => <span key={index} style={{ height: `${Math.max(12, Math.min(100, day.calories / 18))}%` }} title={`${day.calories} kcal`} />)}</div>
        </article>

        <article className="panel">
          <div className="panel__header"><div><p className="eyebrow">Next up</p><h3>Upcoming meals</h3></div></div>
          <div className="compact-list">{(upcomingMeals.length ? upcomingMeals : recentRecipes).map(recipe => { const meta = getRecipeMeta(recipe); return <Link to="/planner" key={recipe.id} className="compact-item"><span>{recipe.name?.slice(0, 1)}</span><div><strong>{recipe.name}</strong><small>{meta.calories} kcal · {meta.protein}g protein</small></div></Link> })}{!loading && recipes.length === 0 && <p className="muted-copy">Create recipes to populate your week.</p>}</div>
        </article>

        <article className="panel panel--wide">
          <div className="panel__header"><div><p className="eyebrow">Library</p><h3>Recent recipes</h3></div><Link to="/recipes">View all</Link></div>
          <div className="recipe-strip">{recentRecipes.map(recipe => { const meta = getRecipeMeta(recipe); return <Link to="/recipes" key={recipe.id} className="strip-card">{recipe.image_url ? <img src={recipe.image_url} alt="" /> : <span>{recipe.name?.slice(0, 1)}</span>}<strong>{recipe.name}</strong><small>{meta.prepTime} min · {meta.difficulty}</small></Link> })}</div>
        </article>
      </section>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useRecipes } from '../hooks/useRecipes'
import { usePlanner } from '../hooks/usePlanner'
import { useProfileGoals } from '../hooks/useProfileGoals'
import PlannerGrid from '../components/planner/PlannerGrid'
import Skeleton from '../components/ui/Skeleton'
import { buildPlannerAnalytics } from '../lib/nutrition'

function getMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d
}
function formatWeekStart(date) { return date.toISOString().split('T')[0] }
function addWeeks(date, n) { const d = new Date(date); d.setDate(d.getDate() + n * 7); return d }
function formatLabel(date) { return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) }

export default function Planner() {
  const { user } = useAuth()
  const { recipes } = useRecipes(user?.id)
  const { goals } = useProfileGoals(user?.id)
  const [currentWeek, setCurrentWeek] = useState(() => getMonday(new Date()))
  const [mobileDay, setMobileDay] = useState(0)
  const weekStart = formatWeekStart(currentWeek)
  const { entries, loading, setEntry } = usePlanner(user?.id, weekStart)
  const analytics = useMemo(() => buildPlannerAnalytics(recipes, entries, goals), [recipes, entries, goals])
  const suggestedRecipes = recipes.slice(0, 8)

  const handleChange = async (dayIndex, mealKey, recipeId) => {
    await setEntry(dayIndex, mealKey, recipeId || null)
  }

  return (
    <div className="planner-page page-fade">
      <section className="page-header-card">
        <div><p className="eyebrow">Weekly calendar</p><h2>{formatLabel(currentWeek)} planning grid</h2><p>Touch, keyboard, and pointer friendly drag & drop with a mobile day switcher.</p></div>
        <div className="planner-nav modern"><button onClick={() => setCurrentWeek(week => addWeeks(week, -1))}>Prev</button><button onClick={() => setCurrentWeek(getMonday(new Date()))}>Today</button><button onClick={() => setCurrentWeek(week => addWeeks(week, 1))}>Next</button></div>
      </section>

      <div className="mobile-day-tabs" role="tablist" aria-label="Planner days">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => <button key={day} className={mobileDay === index ? 'active' : ''} onClick={() => setMobileDay(index)}>{day}</button>)}
      </div>

      <section className="planner-layout planner-layout--single" style={{ '--mobile-day': mobileDay }}>
        <section className="planner-main">
          <div className="planner-summary">
            <article><span>Coverage</span><strong>{analytics.plannedCount}/21</strong></article>
            <article><span>Daily kcal</span><strong>{analytics.averages.calories}</strong></article>
            <article><span>Protein</span><strong>{analytics.averages.protein}g</strong></article>
          </div>
          {loading ? <div className="planner-skeleton"><Skeleton /><Skeleton /><Skeleton /></div> : <PlannerGrid recipes={recipes} entries={entries} onEntryChange={handleChange} dockRecipes={suggestedRecipes} />}
        </section>
      </section>
    </div>
  )
}

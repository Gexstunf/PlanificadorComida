import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useRecipes } from '../hooks/useRecipes'
import { usePlanner } from '../hooks/usePlanner'
import PlannerGrid from '../components/planner/PlannerGrid'

function getMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d
}

function formatWeekStart(date) {
  return date.toISOString().split('T')[0]
}

function addWeeks(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n * 7)
  return d
}

function formatLabel(date) {
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default function Planner() {
  const { user } = useAuth()
  const { recipes } = useRecipes(user?.id)
  const [currentWeek, setCurrentWeek] = useState(() => getMonday(new Date()))

  const weekStart = formatWeekStart(currentWeek)
  const { entries, loading, setEntry } = usePlanner(user?.id, weekStart)

  const goToPrev = () => setCurrentWeek(w => addWeeks(w, -1))
  const goToNext = () => setCurrentWeek(w => addWeeks(w, +1))
  const goToNow = () => setCurrentWeek(getMonday(new Date()))
  const isCurrentWeek = weekStart === formatWeekStart(getMonday(new Date()))

  const handleChange = async (dayIndex, mealKey, recipeId) => {
    await setEntry(dayIndex, mealKey, recipeId || null)
  }

  if (loading) return <p className="loading-copy">Cargando planificador...</p>

  return (
    <div className="planner-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Organización semanal</p>
          <h1>Planificador semanal</h1>
          <p>Asigná recetas por día y comida para armar tu semana sin improvisar.</p>
        </div>
      </div>

      <div className="planner-nav">
        <button onClick={goToPrev}>← Semana anterior</button>
        <div className="planner-nav__center">
          <span>{formatLabel(currentWeek)}</span>
          {!isCurrentWeek && (
            <button className="btn-today" onClick={goToNow}>Hoy</button>
          )}
        </div>
        <button onClick={goToNext}>Semana siguiente →</button>
      </div>

      <PlannerGrid recipes={recipes} entries={entries} onEntryChange={handleChange} />
    </div>
  )
}

import { useAuth } from '../context/AuthContext'
import { useRecipes } from '../hooks/useRecipes'
import { usePlanner } from '../hooks/usePlanner'

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const MEALS = [
    { key: 'breakfast', label: 'Desayuno' },
    { key: 'lunch',     label: 'Almuerzo' },
    { key: 'dinner',    label: 'Cena'     },
]

export default function Planner() {
    const { user } = useAuth()
    const { recipes } = useRecipes(user?.id)
    const { entries, loading, setEntry } = usePlanner(user?.id)

  // entries = { "0-breakfast": recipeId, "2-lunch": recipeId, ... }
    const getEntry = (day, meal) => entries[`${day}-${meal}`] || ''

    const handleChange = async (day, meal, recipeId) => {
        await setEntry(day, meal, recipeId || null)
    }

    if (loading) return <p>Cargando planificador...</p>

    return (
        <div className="planner-page">
            <h1>Planificador Semanal</h1>
        <div className="planner-grid">
            {/* Header */}
            <div className="planner-cell header-cell" />
            {DAYS.map(d => (
            <div key={d} className="planner-cell header-cell">{d}</div>
        ))}

        {/* Filas por tipo de comida */}
        {MEALS.map(meal => (
            <>
                <div key={meal.key} className="planner-cell meal-label">{meal.label}</div>
                {DAYS.map((_, dayIndex) => (
                    <div key={dayIndex} className="planner-cell">
                        <select
                            value={getEntry(dayIndex, meal.key)}
                            onChange={e => handleChange(dayIndex, meal.key, e.target.value)}
                        >
                        <option value="">— Sin asignar —</option>
                        {recipes.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                </select>
                </div>
            ))}
            </>
        ))}
        </div>
    </div>
    )
}
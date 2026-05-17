import MealCell from './MealCell'

const DAYS  = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const MEALS = [
    { key: 'breakfast', label: 'Desayuno' },
    { key: 'lunch',     label: 'Almuerzo' },
    { key: 'dinner',    label: 'Cena'     },
]

export default function PlannerGrid({ recipes, entries, onEntryChange }) {
    return (
        <div className="planner-grid">
            {/* Header — días */}
            <div className="planner-cell header-cell" />
                {DAYS.map(day => (
                    <div key={day} className="planner-cell header-cell">{day}</div>
                ))}

            {/* Filas por comida */}
                {MEALS.map(meal => (
                    <div key={meal.key} style={{ display: 'contents' }}>
                    <div className="planner-cell meal-label">{meal.label}</div>
                    {DAYS.map((_, dayIndex) => (
                        <MealCell
                            key={`${meal.key}-${dayIndex}`}
                            recipes={recipes}
                            value={entries[`${dayIndex}-${meal.key}`] || ''}
                            onChange={recipeId => onEntryChange(dayIndex, meal.key, recipeId)}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}
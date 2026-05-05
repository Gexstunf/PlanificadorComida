export default function MealCell({ recipes, value, onChange }) {
    return (
        <div className="planner-cell">
            <select value={value || ''} onChange={e => onChange(e.target.value)}>
                <option value="">— Sin asignar —</option>
                    {recipes.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
            </select>
        </div>
    )
}
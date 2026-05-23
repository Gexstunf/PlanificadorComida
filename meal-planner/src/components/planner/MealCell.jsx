export default function MealCell({ recipes, value, onChange }) {
  return (
    <div className="meal-slot">
      <select value={value || ''} onChange={event => onChange(event.target.value)}>
        <option value="">Drop or choose meal</option>
        {recipes.map(recipe => <option key={recipe.id} value={recipe.id}>{recipe.name}</option>)}
      </select>
    </div>
  )
}

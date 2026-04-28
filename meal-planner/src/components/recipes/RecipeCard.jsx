export default function RecipeCard({ recipe, onEdit, onDelete }) {
    return (
        <div className="recipe-card">
            <div className="recipe-card__header">
                <h3 className="recipe-card__name">{recipe.name}</h3>
                <div className="recipe-card__actions">
                    <button onClick={onEdit} className="btn btn--secondary">Editar</button>
                    <button onClick={onDelete} className="btn btn--danger">Eliminar</button>
                </div>
            </div>

            {recipe.instructions && (
                <p className="recipe-card__instructions">{recipe.instructions}</p>
            )}

            {recipe.recipe_ingredients?.length > 0 && (
                <div className="recipe-card__ingredients">
                    <h4>Ingredientes</h4>
                    <ul>
                        {recipe.recipe_ingredients.map((ing, i) => (
                            <li key={i}>
                                {ing.name} — {ing.quantity} {ing.unit}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
export default function RecipeCard({ recipe, onEdit, onDelete }) {
  return (
    <article className="recipe-card">
      {recipe.image_url ? (
        <img src={recipe.image_url} alt={recipe.name} className="recipe-card__image" />
      ) : (
        <div className="recipe-card__image recipe-card__image--empty">
          <span>{recipe.name?.slice(0, 1) || 'R'}</span>
        </div>
      )}

      <div className="recipe-card__body">
        <div className="recipe-card__header">
          <h3 className="recipe-card__name">{recipe.name}</h3>
          <div className="recipe-card__actions">
            <button onClick={onEdit} className="btn btn--secondary btn--sm">Editar</button>
            <button onClick={onDelete} className="btn btn--danger btn--sm">Eliminar</button>
          </div>
        </div>

        {recipe.instructions && (
          <p className="recipe-card__instructions">{recipe.instructions}</p>
        )}

        {recipe.recipe_ingredients?.length > 0 && (
          <div className="recipe-card__ingredients">
            <h4>Ingredientes</h4>
            <ul>
              {recipe.recipe_ingredients.slice(0, 8).map((ing, i) => (
                <li key={i}>{ing.name} - {ing.quantity} {ing.unit}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  )
}

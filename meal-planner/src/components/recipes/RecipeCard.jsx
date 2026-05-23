import Icon from '../ui/Icon'
import { getRecipeMeta } from '../../lib/nutrition'

export default function RecipeCard({ recipe, onEdit, onDelete, favorite, onFavorite }) {
  const meta = getRecipeMeta(recipe)

  return (
    <article className="recipe-card premium-card">
      <div className="recipe-card__media">
        {recipe.image_url ? <img src={recipe.image_url} alt={recipe.name} /> : <div className="recipe-card__fallback">{recipe.name?.slice(0, 1) || 'R'}</div>}
        <button className={`favorite-button ${favorite ? 'active' : ''}`} onClick={onFavorite} aria-label="Toggle favorite"><Icon name="favorite" /></button>
      </div>

      <div className="recipe-card__body">
        <div className="recipe-card__topline">
          <span>{meta.difficulty}</span>
          <span><Icon name="clock" /> {meta.prepTime} min</span>
        </div>
        <h3>{recipe.name}</h3>
        {recipe.instructions && <p>{recipe.instructions}</p>}

        <div className="macro-pills">
          <span><Icon name="fire" /> {meta.calories} kcal</span>
          <span><Icon name="protein" /> {meta.protein}g</span>
          <span><Icon name="carbs" /> {meta.carbs}g</span>
          <span><Icon name="fat" /> {meta.fat}g</span>
        </div>

        <div className="tag-row">
          {meta.tags.map(tag => <span key={tag}>{tag}</span>)}
        </div>

        <div className="recipe-card__actions">
          <button onClick={onEdit} className="btn btn--secondary btn--sm">Edit</button>
          <button onClick={onDelete} className="btn btn--danger btn--sm">Delete</button>
        </div>
      </div>
    </article>
  )
}

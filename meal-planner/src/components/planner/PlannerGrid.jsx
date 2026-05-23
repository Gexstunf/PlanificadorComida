import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, closestCenter, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import Icon from '../ui/Icon'
import { getRecipeMeta } from '../../lib/nutrition'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MEALS = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
]

function mealDragId(recipeId, source = 'dock') {
  return `${source}::${recipeId}`
}

function parseDragId(id) {
  const [source, recipeId] = String(id).split('::')
  const [dayIndex, mealKey] = source.includes('|') ? source.split('|') : [null, null]
  return { source, recipeId, dayIndex: dayIndex === null ? null : Number(dayIndex), mealKey }
}

function DroppableSlot({ id, children, filled }) {
  const { isOver, setNodeRef } = useDroppable({ id })
  return <div ref={setNodeRef} className={`meal-slot ${filled ? 'is-filled' : ''} ${isOver ? 'is-over' : ''}`}>{children}</div>
}

function DraggableMeal({ recipe, source, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: mealDragId(recipe.id, source),
    data: { recipeId: recipe.id, source },
  })
  const style = { transform: CSS.Translate.toString(transform) }

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? 'is-dragging' : ''} {...listeners} {...attributes}>
      {children}
    </div>
  )
}

function MealCard({ recipe, onRemove, compact = false }) {
  const meta = getRecipeMeta(recipe)
  return (
    <article className={compact ? 'dock-meal' : 'meal-chip'}>
      {!compact && <Icon name="grip" />}
      {compact && (recipe.image_url ? <img src={recipe.image_url} alt="" /> : <span>{recipe.name?.slice(0, 1)}</span>)}
      <div>
        <strong>{recipe.name}</strong>
        <small>{meta.calories} kcal · {meta.protein}g protein</small>
      </div>
      {onRemove && <button onClick={onRemove} aria-label="Remove meal"><Icon name="close" size={16} /></button>}
    </article>
  )
}

export default function PlannerGrid({ recipes, entries, onEntryChange, dockRecipes = [] }) {
  const [activeRecipe, setActiveRecipe] = useState(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  )
  const getRecipe = recipeId => recipes.find(recipe => recipe.id === recipeId)

  const handleDragStart = event => {
    const { recipeId } = parseDragId(event.active.id)
    setActiveRecipe(getRecipe(recipeId))
  }

  const handleDragEnd = event => {
    setActiveRecipe(null)
    if (!event.over) return
    const { recipeId, dayIndex: sourceDay, mealKey: sourceMeal } = parseDragId(event.active.id)
    const [targetDayRaw, targetMeal] = String(event.over.id).split('|')
    const targetDay = Number(targetDayRaw)
    if (!recipeId || Number.isNaN(targetDay) || !targetMeal) return
    onEntryChange(targetDay, targetMeal, recipeId)
    if (sourceDay !== null && (sourceDay !== targetDay || sourceMeal !== targetMeal)) {
      onEntryChange(sourceDay, sourceMeal, null)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {dockRecipes.length > 0 && (
        <div className="dock-list">
          {dockRecipes.map(recipe => <DraggableMeal key={recipe.id} recipe={recipe} source="dock"><MealCard recipe={recipe} compact /></DraggableMeal>)}
        </div>
      )}

      <div className="planner-board" aria-label="Weekly meal planner">
        <div className="planner-board__days"><span />{DAYS.map((day, index) => <strong key={day}>{day}<small>Day {index + 1}</small></strong>)}</div>
        {MEALS.map(meal => (
          <div className="planner-row" key={meal.key}>
            <div className="planner-row__label"><span>{meal.label}</span></div>
            {DAYS.map((day, dayIndex) => {
              const key = `${dayIndex}-${meal.key}`
              const recipeId = entries[key]
              const recipe = getRecipe(recipeId)
              return (
                <DroppableSlot key={`${day}-${meal.key}`} id={`${dayIndex}|${meal.key}`} filled={Boolean(recipe)}>
                  {recipe ? (
                    <DraggableMeal recipe={recipe} source={`${dayIndex}|${meal.key}`}>
                      <MealCard recipe={recipe} onRemove={() => onEntryChange(dayIndex, meal.key, null)} />
                    </DraggableMeal>
                  ) : (
                    <select value="" onChange={event => onEntryChange(dayIndex, meal.key, event.target.value || null)} aria-label={`Select ${meal.label} for ${day}`}>
                      <option value="">Drop or choose meal</option>
                      {recipes.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                  )}
                </DroppableSlot>
              )
            })}
          </div>
        ))}
      </div>
      <DragOverlay>{activeRecipe ? <MealCard recipe={activeRecipe} /> : null}</DragOverlay>
    </DndContext>
  )
}

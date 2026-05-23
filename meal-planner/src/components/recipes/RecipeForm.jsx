import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { uploadRecipeImage } from '../../hooks/useRecipeImage'
import IngredientRow from './IngredientRow'

const emptyIngredient = () => ({ name: '', quantity: '', unit: 'g' })

export default function RecipeForm({ initialData, onSubmit, onCancel }) {
  const { user } = useAuth()
  const [name, setName] = useState(initialData?.name || '')
  const [instructions, setInstructions] = useState(initialData?.instructions || '')
  const [calories, setCalories] = useState(initialData?.calories || '')
  const [protein, setProtein] = useState(initialData?.protein_g || '')
  const [carbs, setCarbs] = useState(initialData?.carbs_g || '')
  const [fat, setFat] = useState(initialData?.fat_g || '')
  const [prepTime, setPrepTime] = useState(initialData?.prep_time_min || '')
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || 'Easy')
  const [ingredients, setIngredients] = useState(initialData?.recipe_ingredients?.length > 0 ? initialData.recipe_ingredients : [emptyIngredient()])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialData?.image_url || null)
  const [uploading, setUploading] = useState(false)

  const updateIngredient = (index, field, value) => {
    setIngredients(prev => prev.map((ing, i) => i === index ? { ...ing, [field]: value } : ing))
  }

  const addIngredient = () => setIngredients(prev => [...prev, emptyIngredient()])
  const removeIngredient = index => {
    if (ingredients.length === 1) return
    setIngredients(prev => prev.filter((_, i) => i !== index))
  }

  const handleImageChange = event => {
    const file = event.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!name.trim()) return alert('El nombre es obligatorio')

    setUploading(true)
    try {
      let image_url = initialData?.image_url || null
      if (imageFile) image_url = await uploadRecipeImage(imageFile, user.id)
      const validIngredients = ingredients.filter(item => item.name.trim() && item.quantity)
      await onSubmit({
        name,
        instructions,
        ingredients: validIngredients,
        image_url,
        calories: calories ? Number(calories) : null,
        protein_g: protein ? Number(protein) : null,
        carbs_g: carbs ? Number(carbs) : null,
        fat_g: fat ? Number(fat) : null,
        prep_time_min: prepTime ? Number(prepTime) : null,
        difficulty,
      })
    } catch (err) {
      alert('Error al guardar: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      <h2>{initialData ? 'Edit recipe' : 'New recipe'}</h2>

      <label>Name *<input value={name} onChange={event => setName(event.target.value)} required /></label>
      <label>Instructions<textarea value={instructions} onChange={event => setInstructions(event.target.value)} rows={4} /></label>

      <fieldset className="nutrition-fieldset">
        <legend>Real nutrition</legend>
        <label>Calories<input type="number" min="0" value={calories} onChange={event => setCalories(event.target.value)} placeholder="520" /></label>
        <label>Protein g<input type="number" min="0" value={protein} onChange={event => setProtein(event.target.value)} placeholder="38" /></label>
        <label>Carbs g<input type="number" min="0" value={carbs} onChange={event => setCarbs(event.target.value)} placeholder="62" /></label>
        <label>Fat g<input type="number" min="0" value={fat} onChange={event => setFat(event.target.value)} placeholder="18" /></label>
        <label>Prep min<input type="number" min="0" value={prepTime} onChange={event => setPrepTime(event.target.value)} placeholder="25" /></label>
        <label>Difficulty<select value={difficulty} onChange={event => setDifficulty(event.target.value)}><option>Easy</option><option>Medium</option><option>Advanced</option></select></label>
      </fieldset>

      <label>Recipe photo{imagePreview && <img src={imagePreview} alt="preview" className="recipe-image-preview" />}<input type="file" accept="image/*" onChange={handleImageChange} /></label>

      <h3>Ingredients</h3>
      {ingredients.map((ing, i) => <IngredientRow key={i} ingredient={ing} index={i} onChange={updateIngredient} onRemove={removeIngredient} isLast={ingredients.length === 1} />)}
      <button className="btn btn--secondary" type="button" onClick={addIngredient}>+ Ingredient</button>

      <div className="form-actions">
        <button className="btn btn--primary" type="submit" disabled={uploading}>{uploading ? 'Saving...' : initialData ? 'Save changes' : 'Create recipe'}</button>
        <button className="btn btn--ghost" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

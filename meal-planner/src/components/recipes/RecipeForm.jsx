import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { uploadRecipeImage } from '../../hooks/useRecipeImage'
import IngredientRow from './IngredientRow'

const emptyIngredient = () => ({ name: '', quantity: '', unit: 'g' })

export default function RecipeForm({ initialData, onSubmit, onCancel }) {
  const { user } = useAuth()

  const [name, setName]               = useState(initialData?.name || '')
  const [instructions, setInstructions] = useState(initialData?.instructions || '')
  const [ingredients, setIngredients] = useState(
    initialData?.recipe_ingredients?.length > 0
      ? initialData.recipe_ingredients
      : [emptyIngredient()]
  )
  const [imageFile, setImageFile]       = useState(null)
  const [imagePreview, setImagePreview] = useState(initialData?.image_url || null)
  const [uploading, setUploading]       = useState(false)

  const updateIngredient = (index, field, value) => {
    setIngredients(prev =>
      prev.map((ing, i) => i === index ? { ...ing, [field]: value } : ing)
    )
  }

  const addIngredient = () => setIngredients(prev => [...prev, emptyIngredient()])

  const removeIngredient = (index) => {
    if (ingredients.length === 1) return
    setIngredients(prev => prev.filter((_, i) => i !== index))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return alert('El nombre es obligatorio')

    setUploading(true)
    try {
      let image_url = initialData?.image_url || null
      if (imageFile) {
        image_url = await uploadRecipeImage(imageFile, user.id)
      }

      const validIngredients = ingredients.filter(i => i.name.trim() && i.quantity)
      onSubmit({ name, instructions, ingredients: validIngredients, image_url })
    } catch (err) {
      alert('Error al subir la imagen: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      <h2>{initialData ? 'Editar receta' : 'Nueva receta'}</h2>

      <label>Nombre *
        <input value={name} onChange={e => setName(e.target.value)} required />
      </label>

      <label>Instrucciones
        <textarea
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
          rows={4}
        />
      </label>

      <label>Foto de la receta
        {imagePreview && (
          <img src={imagePreview} alt="preview" className="recipe-image-preview" />
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>

      <h3>Ingredientes</h3>
      {ingredients.map((ing, i) => (
        <IngredientRow
          key={i}
          ingredient={ing}
          index={i}
          onChange={updateIngredient}
          onRemove={removeIngredient}
          isLast={ingredients.length === 1}
        />
      ))}

      <button type="button" onClick={addIngredient}>+ Ingrediente</button>

      <div className="form-actions">
        <button type="submit" disabled={uploading}>
          {uploading ? 'Subiendo...' : initialData ? 'Guardar cambios' : 'Crear receta'}
        </button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  )
}

import { useState } from 'react'

const UNITS = ['g', 'kg', 'ml', 'L', 'taza', 'cda', 'cdta', 'unidad']

const emptyIngredient = () => ({ name: '', quantity: '', unit: 'g' })

export default function RecipeForm({ initialData, onSubmit, onCancel }) {
    const [name, setName] = useState(initialData?.name || '')
    const [instructions, setInstructions] = useState(initialData?.instructions || '')
    const [ingredients, setIngredients] = useState(
        initialData?.recipe_ingredients?.length > 0
            ? initialData.recipe_ingredients
            : [emptyIngredient()]
    )

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

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!name.trim()) return alert('El nombre es obligatorio')
        const validIngredients = ingredients.filter(i => i.name.trim() && i.quantity)
        onSubmit({ name, instructions, ingredients: validIngredients })
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

            <h3>Ingredientes</h3>
            {ingredients.map((ing, i) => (
                <div key={i} className="ingredient-row">
                    <input
                        placeholder="Ingrediente"
                        value={ing.name}
                        onChange={e => updateIngredient(i, 'name', e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Cantidad"
                        value={ing.quantity}
                        min="0"
                        step="0.1"
                        onChange={e => updateIngredient(i, 'quantity', e.target.value)}
                    />
                    <select
                        value={ing.unit}
                        onChange={e => updateIngredient(i, 'unit', e.target.value)}
                    >
                    {UNITS.map(u => <option key={u}>{u}</option>)}
                    </select>
                    <button type="button" onClick={() => removeIngredient(i)}>✕</button>
                </div>
            ))}

            <button type="button" onClick={addIngredient}>+ Ingrediente</button>

            <div className="form-actions">
                <button type="submit">{initialData ? 'Guardar cambios' : 'Crear receta'}</button>
                <button type="button" onClick={onCancel}>Cancelar</button>
            </div>
        </form>
    )
}
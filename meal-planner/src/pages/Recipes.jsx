import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRecipes } from "../hooks/useRecipes";
import RecipeForm from "../components/recipes/RecipeForm";
import RecipeCard from "../components/recipes/RecipeCard";

export default function Recipes() {
    const { user } = useAuth()
    const { recipes, loading, error, createRecipe, updateRecipe, deleteRecipe } = useRecipes(user?.id)

    const [showForm, setShowForm] = useState(false)
    const [editingRecipe, setEditingRecipe] = useState(null)

    const handleSumit = async (formData) => {
        try {
            if (editingRecipe) {
                await updateRecipe(editingRecipe.id, formData)
            } else {
                await createRecipe(formData)
            }
            setShowForm(false)
            setEditingRecipe(null)
        } catch (e) {
            alert('Error: ' + e.message)
        }
    }

    const handleEdit = (recipe) => {
        setEditingRecipe(recipe)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar receta?')) return
        try {
            await deleteRecipe(id)
        } catch (e) {
            alert('Error: ' + e.message)
        }
    }

    if (loading) return <p>Cargando recetas...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div className="recipes-page">
            <div className="recipes-header">
                <h1>Mis Recetas</h1>
                <button onClick={() => { setEditingRecipe(null); setShowForm(true) }}>
                + Nueva receta
                </button>
            </div>

            {showForm && (
                <RecipeForm
                initialData={editingRecipe}
                onSubmit={handleSubmit}
                onCancel={() => { setShowForm(false); setEditingRecipe(null) }}
                />
            )}

            {recipes.length === 0 ? (
                <p>Todavía no tenés recetas. ¡Creá una!</p>
            ) : (
            <div className="recipes-grid">
            {recipes.map(recipe => (
            <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onEdit={() => handleEdit(recipe)}
                onDelete={() => handleDelete(recipe.id)}
            />
            ))}
            </div>
        )}
        </div>
    )
}
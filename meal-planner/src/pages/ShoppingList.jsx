import { useState, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useRecipes } from '../hooks/useRecipes'
import { usePlanner } from '../hooks/usePlanner'

export default function ShoppingList() {
    const { user } = useAuth()
    const { recipes } = useRecipes(user?.id)
    const { entries } = usePlanner(user?.id)
    const [checked, setChecked] = useState({})

    const shoppingItems = useMemo(() => {
        const recipeIds = Object.values(entries).filter(Boolean)
        const map = {}
        recipeIds.forEach(recipeId => {
            const recipe = recipes.find(r => r.id === recipeId)
            recipe?.recipe_ingredients?.forEach(ing => {
                const key = `${ing.name.toLowerCase()}|${ing.unit}`
                map[key] = map[key]
                    ? { ...map[key], quantity: map[key].quantity + Number(ing.quantity) }
                    : { name: ing.name, unit: ing.unit, quantity: Number(ing.quantity) }
            })
        })
        return Object.values(map).sort((a, b) => a.name.localeCompare(b.name))
    }, [entries, recipes])

    const toggle = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }))

    const pending = shoppingItems.filter(i => !checked[`${i.name}|${i.unit}`])
    const done    = shoppingItems.filter(i =>  checked[`${i.name}|${i.unit}`])

    return (
        <div className="shopping-page">
            <h1>Lista de Compras</h1>
            <p>{pending.length} ítems pendientes · {done.length} comprados</p>

            {shoppingItems.length === 0 ? (
                <p>Asigná recetas en el planificador para generar la lista.</p>
            ) : (
            <>
                <ul className="shopping-list">
                    {pending.map(item => {
                        const key = `${item.name}|${item.unit}`
                        return (
                            <li key={key}>
                                <label>
                                    <input type="checkbox" onChange={() => toggle(key)} />
                                    <span>{item.name}</span>
                                    <span>{item.quantity} {item.unit}</span>
                                </label>
                            </li>
                        )
                    })}
                </ul>

                {done.length > 0 && (
                    <>
                        <h3>Comprados</h3>
                        <ul>
                            {done.map(item => {
                                const key = `${item.name}|${item.unit}`
                                return (
                                    <li key={key}>
                                        <label>
                                            <input type="checkbox" checked onChange={() => toggle(key)} />
                                            <span>{item.name}</span>
                                            <span>{item.quantity} {item.unit}</span>
                                        </label>
                                    </li>
                                )
                            })}
                        </ul>
                    </>
                )}
            </>
            )}
    </div>
    )
}
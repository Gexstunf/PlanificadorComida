const UNITS = ['g', 'kg', 'ml', 'L', 'taza', 'cda', 'cdta', 'unidad']

export default function IngredientRow({ ingredient, index, onChange, onRemove, isLast }) {
    return (
        <div className="ingredient-row">
            <input
                    placeholder="Ingrediente"
                    value={ingredient.name}
                    onChange={e => onChange(index, 'name', e.target.value)}
            />
            <input
                    type="number"
                    placeholder="Cant."
                    value={ingredient.quantity}
                    min="0"
                    step="0.1"
                    onChange={e => onChange(index, 'quantity', e.target.value)}
            />
            <select
                    value={ingredient.unit}
                    onChange={e => onChange(index, 'unit', e.target.value)}
            >
            {UNITS.map(u => <option key={u}>{u}</option>)}
            </select>
                <button
                    type="button"
                    className="btn btn--danger btn--sm"
                    onClick={() => onRemove(index)}
                    disabled={isLast}
                    title="Eliminar ingrediente"
            >
            ✕
            </button>
        </div>
    )
}
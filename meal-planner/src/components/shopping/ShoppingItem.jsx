export default function ShoppingItem({ item, checked, onToggle }) {
    const key = `${item.name}|${item.unit}`

    return (
        <li className={`shopping-list__item ${checked ? 'done' : ''}`}>
            <label>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(key)}
                />
                <span className="shopping-list__name">{item.name}</span>
                <span className="shopping-list__qty">{item.quantity} {item.unit}</span>
            </label>
        </li>
    ) 
}
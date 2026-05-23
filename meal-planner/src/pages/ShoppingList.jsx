import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useRecipes } from '../hooks/useRecipes'
import { usePlanner } from '../hooks/usePlanner'
import { useShoppingChecks } from '../hooks/useShoppingChecks'
import { buildShoppingItems, groupShoppingItems } from '../lib/shopping'
import Skeleton from '../components/ui/Skeleton'

function getWeekStart() {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(now.setDate(diff)).toISOString().split('T')[0]
}

export default function ShoppingList() {
  const { user } = useAuth()
  const { recipes, loading: recipesLoading } = useRecipes(user?.id)
  const weekStart = getWeekStart()
  const { entries, loading: plannerLoading } = usePlanner(user?.id, weekStart)
  const { checked, toggle, remoteReady } = useShoppingChecks(user?.id, weekStart)

  const shoppingItems = useMemo(() => buildShoppingItems(recipes, entries), [entries, recipes])
  const grouped = useMemo(() => groupShoppingItems(shoppingItems), [shoppingItems])
  const pending = shoppingItems.filter(item => !checked[item.key])
  const done = shoppingItems.filter(item => checked[item.key])
  const loading = recipesLoading || plannerLoading

  return (
    <div className="shopping-page page-fade">
      <section className="page-header-card">
        <div><p className="eyebrow">Smart shopping</p><h2>Auto-generated grocery system</h2><p>{pending.length} pending · {done.length} completed · {Object.keys(grouped).length} categories · {remoteReady ? 'synced' : 'local fallback'}</p></div>
      </section>

      {loading ? <div className="shopping-groups">{[0, 1, 2].map(item => <Skeleton key={item} className="shopping-skeleton" />)}</div> : shoppingItems.length === 0 ? <div className="empty-state"><h2>Your list is empty</h2><p>Add meals to the planner to generate ingredients automatically.</p></div> : (
        <div className="shopping-layout">
          <section className="shopping-groups">
            {Object.entries(grouped).map(([category, items], index) => (
              <motion.article className="shopping-category panel" key={category} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                <div className="panel__header"><div><p className="eyebrow">Category</p><h3>{category}</h3></div><span className="panel__badge">{items.length}</span></div>
                <ul className="shopping-list">
                  {items.map(item => <li key={item.key} className={checked[item.key] ? 'done' : ''}><label><input type="checkbox" checked={Boolean(checked[item.key])} onChange={() => toggle(item.key)} /><span>{item.name}</span><strong>{item.quantity} {item.unit}</strong></label></li>)}
                </ul>
              </motion.article>
            ))}
          </section>

          <aside className="panel shopping-insights">
            <div className="panel__header"><div><p className="eyebrow">Cart health</p><h3>Progress</h3></div></div>
            <div className="cart-score"><strong>{Math.round((done.length / shoppingItems.length) * 100) || 0}%</strong><span>completed</span></div>
            <div className="meter"><span style={{ width: `${Math.round((done.length / shoppingItems.length) * 100) || 0}%` }} /></div>
            <p className="muted-copy">Duplicates are merged by ingredient and unit. Checked state persists in Supabase when the migration exists.</p>
          </aside>
        </div>
      )}
    </div>
  )
}

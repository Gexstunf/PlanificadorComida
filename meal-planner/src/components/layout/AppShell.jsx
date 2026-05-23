import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../ui/Icon'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/planner', label: 'Planner', icon: 'calendar' },
  { to: '/recipes', label: 'Recipes', icon: 'recipes' },
  { to: '/shopping', label: 'Shopping', icon: 'shopping' },
  { to: '/profile', label: 'Profile', icon: 'profile' },
]

export default function AppShell({ children }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const activeItem = NAV_ITEMS.find(item => item.to === location.pathname) || NAV_ITEMS[0]

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className={`app-shell ${collapsed ? 'is-collapsed' : ''}`}>
      <aside className="sidebar">
        <Link className="brand" to="/dashboard" aria-label="Meal OS dashboard">
          <span className="brand__mark">M</span>
          <span className="brand__copy"><strong>Meal OS</strong><small>Nutrition planner</small></span>
        </Link>

        <nav className="sidebar__nav" aria-label="Primary navigation">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'active' : ''}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <section className="sidebar__panel">
          <p>Weekly focus</p>
          <strong>High protein balance</strong>
          <div className="sidebar__progress"><span style={{ width: '68%' }} /></div>
        </section>

        <button className="sidebar__collapse" onClick={() => setCollapsed(value => !value)} aria-label="Collapse sidebar">
          <Icon name="collapse" />
          <span>Collapse</span>
        </button>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <span className="topbar__eyebrow">Futuristic meal intelligence</span>
            <h1>{activeItem.label}</h1>
          </div>
          <div className="topbar__actions">
            <div className="topbar__search"><Icon name="search" /><span>Search meals, ingredients, plans</span></div>
            <div className="topbar__user" title={user?.email}><span>{user?.email?.slice(0, 1)?.toUpperCase() || 'U'}</span></div>
            <button className="icon-button" onClick={handleLogout} aria-label="Sign out"><Icon name="logout" /></button>
          </div>
        </header>

        <main className="workspace__content">{children}</main>
      </div>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.slice(0, 4).map(item => (
          <NavLink key={item.to} to={item.to}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

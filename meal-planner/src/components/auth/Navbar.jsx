import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  const authPages = ['/login', '/register']
  if (authPages.includes(location.pathname)) return null

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link to="/recipes">
          <span className="brand-mark">MP</span>
          <span>Meal Planner</span>
        </Link>
      </div>

      <div className="navbar__links">
        <Link to="/recipes" className={location.pathname === '/recipes' ? 'active' : ''}>Recetas</Link>
        <Link to="/planner" className={location.pathname === '/planner' ? 'active' : ''}>Planificador</Link>
        <Link to="/shopping" className={location.pathname === '/shopping' ? 'active' : ''}>Compras</Link>
        <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Perfil</Link>
      </div>

      <div className="navbar__user">
        <span className="navbar__email">{user?.email}</span>
        <button onClick={handleLogout} className="navbar__logout">Salir</button>
      </div>
    </nav>
  )
}

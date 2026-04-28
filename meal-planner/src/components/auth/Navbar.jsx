import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
    const { user, signOut } = useAuth()
    const navigate          = useNavigate()
    const location          = useLocation()

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
                <Link to="/recipes">🍽️ Meal Planner</Link>
            </div>

            <div className="navbar__links">
                    <Link
                        to="/recipes"
                        className={location.pathname === '/recipes' ? 'active' : ''}
                    >
                Recetas
                    </Link>
                    <Link
                        to="/planner"
                        className={location.pathname === '/planner' ? 'active' : ''}
                    >
                Planificador
                    </Link>
                    <Link
                        to="/shopping"
                        className={location.pathname === '/shopping' ? 'active' : ''}
                    >
                Lista de compras
                </Link>
            </div>

            <div className="navbar__user">
                <span className="navbar__email">{user?.email}</span>
                <button onClick={handleLogout} className="navbar__logout">
                Cerrar sesión
                </button>
            </div>
        </nav>
    )
}
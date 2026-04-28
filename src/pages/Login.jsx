import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const { signIn } = useAuth()
    const navigate   = useNavigate()

    const [email,    setEmail]    = useState('')
    const [password, setPassword] = useState('')
    const [error,    setError]    = useState(null)
    const [loading,  setLoading]  = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            await signIn(email, password)
            navigate('/recipes')          // redirige a la app de Alumno 2
        } catch (err) {
            setError(traducirError(err.message))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-card__header">
                    <span className="auth-card__icon">🍽️</span>
                    <h1 className="auth-card__title">Meal Planner</h1>
                    <p className="auth-card__subtitle">Iniciá sesión para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                {error && <p className="auth-form__error">{error}</p>}

                <div className="auth-form__field">
                    <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                            autoComplete="email"
                    />
                </div>

                <div className="auth-form__field">
                    <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                    />
                </div>

                <button type="submit" className="auth-form__submit" disabled={loading}>
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
                </button>
            </form>

            <p className="auth-card__footer">
                ¿No tenés cuenta?{' '}
            <Link to="/register">Registrate</Link>
            </p>
            </div>
        </div>
    )
}

function traducirError(msg) {
    if (msg.includes('Invalid login credentials')) return 'Email o contraseña incorrectos.'
    if (msg.includes('Email not confirmed'))        return 'Confirmá tu email antes de ingresar.'
    if (msg.includes('too many requests'))          return 'Demasiados intentos. Esperá unos minutos.'
    return msg
}
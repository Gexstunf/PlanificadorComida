import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
    const { signUp } = useAuth()
    const navigate   = useNavigate()

    const [email,     setEmail]     = useState('')
    const [password,  setPassword]  = useState('')
    const [confirm,   setConfirm]   = useState('')
    const [error,     setError]     = useState(null)
    const [success,   setSuccess]   = useState(false)
    const [loading,   setLoading]   = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (password !== confirm) {
            return setError('Las contraseñas no coinciden.')
        }
        if (password.length < 6) {
            return setError('La contraseña debe tener al menos 6 caracteres.')
        }

        setLoading(true)
        try {
            await signUp(email, password)
            setSuccess(true)
            setTimeout(() => navigate('/recipes'), 2000)
        } catch (err) {
            setError(traducirError(err.message))
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-card auth-card--success">
                <span className="auth-card__icon">✅</span>
                <h2>¡Cuenta creada!</h2>
                <p>Redirigiendo a la app...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-card__header">
                    <span className="auth-card__icon">🍽️</span>
                    <h1 className="auth-card__title">Meal Planner</h1>
                    <p className="auth-card__subtitle">Creá tu cuenta gratis</p>
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
                            placeholder="Mínimo 6 caracteres"
                            required
                            autoComplete="new-password"
                        />
                </div>

                <div className="auth-form__field">
                    <label htmlFor="confirm">Confirmar contraseña</label>
                        <input
                            id="confirm"
                            type="password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            placeholder="Repetí la contraseña"
                            required
                            autoComplete="new-password"
                    />
                </div>

                <button type="submit" className="auth-form__submit" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Registrarse'}
                </button>
            </form>

                <p className="auth-card__footer">
                ¿Ya tenés cuenta?{' '}
                <Link to="/login">Iniciá sesión</Link>
                </p>
            </div>
        </div>
    )
}

function traducirError(msg) {
    if (msg.includes('already registered'))    return 'Este email ya está registrado.'
    if (msg.includes('invalid email'))         return 'El email no es válido.'
    if (msg.includes('Password should be'))    return 'La contraseña debe tener al menos 6 caracteres.'
    return msg
}
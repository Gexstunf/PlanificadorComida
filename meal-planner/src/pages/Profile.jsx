import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'

export default function Profile() {
  const { user } = useAuth()
  const [email, setEmail]       = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [success, setSuccess]   = useState(null)
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const updates = {}
      if (email !== user.email) updates.email = email
      if (password) updates.password = password

      if (Object.keys(updates).length === 0) {
        setError('No hay cambios para guardar.')
        setLoading(false)
        return
      }

      const { error } = await supabase.auth.updateUser(updates)
      if (error) throw error
      setSuccess('Perfil actualizado correctamente.')
      setPassword('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>Mi perfil</h1>
        <p className="profile-email-label">
          Usuario actual: <strong>{user?.email}</strong>
        </p>

        <form onSubmit={handleUpdate} className="auth-form">
          {error && <p className="auth-form__error">{error}</p>}
          {success && <p className="auth-form__success">{success}</p>}

          <div className="auth-form__field">
            <label>Nuevo email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={user?.email}
            />
          </div>

          <div className="auth-form__field">
            <label>Nueva contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Dejar vacío para no cambiar"
            />
          </div>

          <button type="submit" className="auth-form__submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}

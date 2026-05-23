import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useProfileGoals } from '../hooks/useProfileGoals'
import { supabase } from '../lib/supabaseClient'
import Icon from '../components/ui/Icon'

export default function Profile() {
  const { user } = useAuth()
  const { goals, saveGoals, remoteReady } = useProfileGoals(user?.id)
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [goalDraft, setGoalDraft] = useState(goals)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { const timer = setTimeout(() => setGoalDraft(goals), 0); return () => clearTimeout(timer) }, [goals])

  const handleAccountUpdate = async event => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const updates = {}
      if (email !== user.email) updates.email = email
      if (password) updates.password = password
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase.auth.updateUser(updates)
        if (error) throw error
      }
      await saveGoals(goalDraft)
      setSuccess(remoteReady ? 'Perfil y objetivos guardados en Supabase.' : 'Objetivos guardados localmente. Aplicá la migración para sincronizar Supabase.')
      setPassword('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateGoal = (field, value) => setGoalDraft(prev => ({ ...prev, [field]: value }))

  return (
    <div className="profile-page page-fade">
      <section className="page-header-card">
        <div><p className="eyebrow">Account intelligence</p><h2>Profile and nutrition goals</h2><p>Define the targets that power dashboard progress, AI prompts, and weekly planning.</p></div>
      </section>

      <form onSubmit={handleAccountUpdate} className="profile-grid">
        <section className="profile-card panel">
          <div className="profile-card__header"><span className="profile-avatar"><Icon name="profile" /></span><div><p className="eyebrow">Account</p><h3>{user?.email}</h3></div></div>
          {error && <p className="auth-form__error">{error}</p>}
          {success && <p className="auth-form__success">{success}</p>}
          <label>New email<input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder={user?.email} /></label>
          <label>New password<input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Leave empty to keep current" /></label>
        </section>

        <section className="profile-card panel">
          <div className="panel__header"><div><p className="eyebrow">Nutrition</p><h3>Daily targets</h3></div></div>
          <div className="goals-grid">
            <label>Calories<input type="number" value={goalDraft.calorie_goal || ''} onChange={event => updateGoal('calorie_goal', Number(event.target.value))} /></label>
            <label>Protein g<input type="number" value={goalDraft.protein_goal || ''} onChange={event => updateGoal('protein_goal', Number(event.target.value))} /></label>
            <label>Weekly budget<input type="number" value={goalDraft.weekly_budget || ''} onChange={event => updateGoal('weekly_budget', Number(event.target.value))} /></label>
            <label>Preferences<textarea rows="3" value={goalDraft.preferences || ''} onChange={event => updateGoal('preferences', event.target.value)} /></label>
            <label>Restrictions<textarea rows="3" value={goalDraft.restrictions || ''} onChange={event => updateGoal('restrictions', event.target.value)} /></label>
          </div>
          <button className="btn btn--primary" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save profile'}</button>
        </section>
      </form>
    </div>
  )
}



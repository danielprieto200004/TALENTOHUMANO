import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const { login, isEditor } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isEditor) {
    navigate('/noticias')
    return null
  }

  function handleSubmit(e) {
    e.preventDefault()
    const ok = login(password)
    if (ok) {
      navigate('/noticias')
    } else {
      setError('Contraseña incorrecta.')
      setPassword('')
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">U</div>
        <h1 className="login-title">Modo editor</h1>
        <p className="login-desc">
          Accede con tu contraseña para crear y editar noticias.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            placeholder="Contraseña"
            autoFocus
            required
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit">Entrar</button>
        </form>

        <button className="login-back" onClick={() => navigate('/')}>
          ← Volver al inicio
        </button>
      </div>
    </div>
  )
}

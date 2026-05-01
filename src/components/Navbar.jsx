import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { isEditor, logout } = useAuth()

  return (
    <header className="navbar-v2">
      <div className="container navbar-v2-inner">
        <NavLink to="/" className="navbar-v2-brand">
          <div className="brand-v2-logo">U</div>
          <div className="brand-v2-text">
            <span className="brand-v2-name">Talento Humano</span>
            <span className="brand-v2-sub">Uniminuto Bogotá</span>
          </div>
        </NavLink>

        <nav className="nav-v2">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-v2-link active' : 'nav-v2-link'}>
            Inicio
          </NavLink>
          <NavLink to="/noticias" className={({ isActive }) => isActive ? 'nav-v2-link active' : 'nav-v2-link'}>
            Noticias
          </NavLink>
          <NavLink to="/sst" className={({ isActive }) => isActive ? 'nav-v2-link active' : 'nav-v2-link'}>
            SG-SSTGA
          </NavLink>
          <NavLink to="/bienestar" className={({ isActive }) => isActive ? 'nav-v2-link active' : 'nav-v2-link'}>
            Bienestar
          </NavLink>
          <NavLink to="/administracion" className={({ isActive }) => isActive ? 'nav-v2-link active' : 'nav-v2-link'}>
            Administración
          </NavLink>

          <div className="nav-v2-divider"></div>

          {isEditor ? (
            <button className="nav-v2-editor-btn" onClick={logout}>
              <span>Cerrar Sesión</span>
            </button>
          ) : (
            <NavLink to="/editor" className="nav-v2-editor-link">
              Acceso Editor
            </NavLink>
          )}
        </nav>
      </div>

      {isEditor && (
        <div className="navbar-v2-editor-status">
          <div className="container">
            <span className="status-dot"></span> Modo Editor Activo
          </div>
        </div>
      )}
    </header>
  )
}

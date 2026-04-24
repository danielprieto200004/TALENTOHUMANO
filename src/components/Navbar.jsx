import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { isEditor, logout } = useAuth()

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-logo">U</div>
          <div className="brand-text">
            <span className="brand-name">Uniminuto</span>
            <span className="brand-sub">Talento Humano · Bogotá</span>
          </div>
        </NavLink>

        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Inicio
          </NavLink>
          <NavLink to="/noticias" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Noticias
          </NavLink>
          <NavLink to="/sst" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            SG-SSTGA
          </NavLink>
          <NavLink to="/bienestar" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Bienestar
          </NavLink>
          <NavLink to="/administracion" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Administración
          </NavLink>

          {isEditor ? (
            <button className="nav-editor-btn" onClick={logout}>
              Salir del editor
            </button>
          ) : (
            <NavLink to="/editor" className="nav-editor-link">
              Editor
            </NavLink>
          )}
        </nav>
      </div>

      {isEditor && (
        <div className="editor-bar">
          <div className="container">
            Modo editor activo — los cambios se guardan automáticamente
          </div>
        </div>
      )}
    </header>
  )
}

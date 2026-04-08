import { Routes, Route, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NewsProvider } from './context/NewsContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import News from './pages/News'
import SST from './pages/SST'
import Bienestar from './pages/Bienestar'
import AdministracionPersonal from './pages/AdministracionPersonal'
import Login from './pages/Login'
import './App.css'

function Layout() {
  return (
    <div className="site">
      <Navbar />
      <Outlet />
      <footer className="footer">
        <div className="container footer-inner">
          <span className="footer-brand">Uniminuto · Talento Humano Bogotá</span>
          <span className="footer-copy">© 2026 Corporación Universitaria Minuto de Dios</span>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <NewsProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/noticias" element={<News />} />
            <Route path="/sst" element={<SST />} />
            <Route path="/bienestar" element={<Bienestar />} />
            <Route path="/administracion" element={<AdministracionPersonal />} />
          </Route>
          <Route path="/editor" element={<Login />} />
        </Routes>
      </NewsProvider>
    </AuthProvider>
  )
}

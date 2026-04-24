import { Link } from 'react-router-dom'
import { useNewsContext } from '../context/NewsContext'
import { CATEGORIA_COLOR } from '../data/defaultNews'
import SectionCard from '../components/SectionCard'
import './Home.css'

const secciones = [
  {
    slug: 'sst',
    titulo: 'Seguridad y Salud en el Trabajo',
    descripcion: 'Políticas, COPASST, reportes de accidentes y plan de emergencias.',
    color: '#dc2626',
  },
  {
    slug: 'bienestar',
    titulo: 'Bienestar y Desarrollo',
    descripcion: 'Programas de bienestar, deporte, cultura y apoyo psicosocial.',
    color: '#00a651',
  },
  {
    slug: 'administracion',
    titulo: 'Administración de Personal',
    descripcion: 'Nómina, vacaciones, certificaciones y trámites laborales.',
    color: '#0C82B2',
  },
]

export default function Home() {
  const { news } = useNewsContext()
  const recientes = news
    .filter((n) => n.publicada)
    .sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion))
    .slice(0, 4)

  const [destacada, ...resto] = recientes

  return (
    <main>
      {/* HERO */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-inner">
            <p className="hero-eyebrow">Dirección de Gestión Humana</p>
            <h1 className="hero-title">
              Portal de<br />Talento Humano
            </h1>
            <p className="hero-desc">
              Información, noticias y comunicados para los colaboradores
              de Uniminuto Bogotá.
            </p>
            <div className="hero-actions">
              <Link to="/noticias" className="btn btn-green">Ver todas las noticias</Link>
              <Link to="/sst" className="btn btn-ghost">SST</Link>
            </div>
          </div>
        </div>
        <div className="hero-curve" />
      </section>

      {/* NOTICIAS RECIENTES */}
      <section className="section">
        <div className="container">
          <div className="home-section-header">
            <h2 className="section-title">Últimas noticias</h2>
            <Link to="/noticias" className="ver-todas">Ver todas →</Link>
          </div>

          {recientes.length === 0 ? (
            <p className="empty-msg">No hay noticias publicadas aún.</p>
          ) : (
            <div className="home-news-layout">
              {destacada && (
                <article className="home-news-lead">
                  <span
                    className="cat-tag"
                    style={{ color: CATEGORIA_COLOR[destacada.categoria] }}
                  >
                    {destacada.categoria}
                  </span>
                  <h3 className="home-news-lead-title">{destacada.titulo}</h3>
                  <p className="home-news-lead-desc">{destacada.resumen}</p>
                  <span className="news-fecha-sm">
                    {new Date(destacada.fechaPublicacion).toLocaleDateString('es-CO', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                </article>
              )}

              <div className="home-news-list">
                {resto.map((n) => (
                  <article key={n.id} className="home-news-item">
                    <div
                      className="cat-dot"
                      style={{ background: CATEGORIA_COLOR[n.categoria] }}
                    />
                    <div>
                      <span
                        className="cat-tag"
                        style={{ color: CATEGORIA_COLOR[n.categoria] }}
                      >
                        {n.categoria}
                      </span>
                      <h3 className="home-news-item-title">{n.titulo}</h3>
                      <span className="news-fecha-sm">
                        {new Date(n.fechaPublicacion).toLocaleDateString('es-CO', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECCIONES */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Áreas de Talento Humano</h2>
          <div className="sections-grid">
            {secciones.map((s) => (
              <SectionCard key={s.slug} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="section-contact">
        <div className="container contact-inner">
          <div className="contact-text">
            <h2 className="contact-title">¿Necesitas ayuda?</h2>
            <p className="contact-desc">
              El equipo de Talento Humano está disponible para atenderte.
            </p>
          </div>
          <div className="contact-info">
            <div className="contact-row">
              <span className="contact-label">Correo</span>
              <span className="contact-value">talentohumano.bogota@uniminuto.edu</span>
            </div>
            <div className="contact-row">
              <span className="contact-label">Teléfono</span>
              <span className="contact-value">+57 601 291 6520 Ext. 6100</span>
            </div>
            <div className="contact-row">
              <span className="contact-label">Ubicación</span>
              <span className="contact-value">Calle 81B #72B-70, Bogotá D.C.</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

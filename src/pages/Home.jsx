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
    color: '#000F26', // Navy
  },
  {
    slug: 'bienestar',
    titulo: 'Bienestar y Desarrollo',
    descripcion: 'Programas de bienestar, deporte, cultura y apoyo psicosocial.',
    color: '#0C82B2', // Coastal Blue
  },
  {
    slug: 'administracion',
    titulo: 'Administración de Personal',
    descripcion: 'Nómina, vacaciones, certificaciones y trámites laborales.',
    color: '#FBBC09', // Electric Sun (Gold)
  },
]

export default function Home() {
  const { news } = useNewsContext()
  const recientes = news
    .filter((n) => n.publicada)
    .sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion))
    .slice(0, 4)

  return (
    <main className="home-page">
      {/* CREATIVE HERO SECTION */}
      <section className="home-hero-v2">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
        <div className="container hero-v2-inner">
          <div className="hero-v2-text">
            <div className="hero-v2-badge">Dirección de Gestión Humana</div>
            <h1 className="hero-v2-title">
              Elevando el <span className="text-accent">Talento</span>, <br /> 
              Transformando el <span className="text-blue">Futuro</span>.
            </h1>
            <p className="hero-v2-desc">
              Bienvenido al ecosistema digital de Talento Humano Uniminuto Bogotá. 
              Encuentra aquí las herramientas y noticias que impulsan tu crecimiento.
            </p>
            <div className="hero-v2-actions">
              <Link to="/noticias" className="hero-btn-primary">Ver Novedades</Link>
              <Link to="/sst" className="hero-btn-secondary">Portal SST</Link>
            </div>
          </div>
          <div className="hero-v2-visual">
            <div className="visual-card">
              <div className="visual-card-content news-pattern-1">
                <span>Gestión 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC NEWS GRID */}
      <section className="home-news-v2">
        <div className="container">
          <div className="news-v2-header">
            <div className="header-labels">
              <span className="label-line"></span>
              <span className="label-text">Actualidad Institucional</span>
            </div>
            <h2 className="news-v2-title">Historias que <br/> conectan.</h2>
          </div>

          <div className="news-v2-grid">
            {recientes.map((n, i) => (
              <Link to="/noticias" key={n.id} className={`news-v2-card card-size-${i}`}>
                <div className="news-v2-card-img-box">
                  {n.imagen?.startsWith('pattern:') ? (
                    <div className={`news-v2-card-pattern news-${n.imagen.replace(':', '-')}`} />
                  ) : (
                    <img src={n.imagen} alt="" className="news-v2-card-img" />
                  )}
                  <div className="news-v2-card-overlay">
                    <span className="btn-circle-plus">+</span>
                  </div>
                </div>
                <div className="news-v2-card-info">
                  <div className="news-v2-meta">
                    <span className="news-v2-cat" style={{ background: CATEGORIA_COLOR[n.categoria] }}>
                      {n.categoria}
                    </span>
                    <span className="news-v2-date">
                      {new Date(n.fechaPublicacion).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="news-v2-card-title">{n.titulo}</h3>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="news-v2-footer">
            <Link to="/noticias" className="btn-explore-all">
              Ir al panel de noticias completo
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* IMMERSIVE SECTIONS */}
      <section className="home-sections-v2">
        <div className="container">
          <div className="sections-v2-inner">
            <div className="sections-v2-header">
              <h2 className="v2-title">Recursos para ti</h2>
              <p className="v2-subtitle">Accede rápidamente a los servicios más importantes de nuestra área.</p>
            </div>
            <div className="sections-v2-grid">
              {secciones.map((s) => (
                <SectionCard key={s.slug} {...s} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOPHISTICATED CONTACT SECTION */}
      <section className="home-contact-v2">
        <div className="container">
          <div className="contact-v2-box">
            <div className="contact-v2-main">
              <h2 className="contact-v2-title">¿Cómo podemos ayudarte hoy?</h2>
              <p className="contact-v2-desc">
                Estamos aquí para acompañarte en cada paso de tu camino laboral. 
                No dudes en escribirnos o visitarnos.
              </p>
              <div className="contact-v2-details">
                <div className="detail-item">
                  <span className="detail-label">Sede Bogotá</span>
                  <span className="detail-value">Calle 81B #72B-70, Bogotá D.C.</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Línea de Atención</span>
                  <span className="detail-value">+57 601 291 6520 Ext. 6100</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Correo Oficial</span>
                  <span className="detail-value">talentohumano.bogota@uniminuto.edu</span>
                </div>
              </div>
            </div>
            <div className="contact-v2-aside">
              <a href="mailto:talentohumano.bogota@uniminuto.edu" className="btn-v2-contact-creative">
                <div className="blob-shape"></div>
                <div className="btn-v2-content">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M7.757 16.243l-2.121 2.121m10.607 0l2.121 2.121M7.757 7.757L5.636 5.636" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span className="btn-v2-label">Escríbenos ahora</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

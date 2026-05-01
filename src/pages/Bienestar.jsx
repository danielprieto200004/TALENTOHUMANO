import { useState, useEffect } from 'react'
import StaticPage from './StaticPage'
import { bienestarData, bienestarTab2Data } from '../data/staticSections'
import unicorporativaImg from '../assets/img/unicorporativa-page.png'
import colegiosImg       from '../assets/img/colegios-minuto-de-dios.webp'
import gimnasiosImg      from '../assets/img/gimnasios.png'
import jardinesImg       from '../assets/img/jardines-de-paz.jpg'
import cooperativaImg   from '../assets/img/cooperativa.png'
import './Bienestar.css'

const ACCENT = '#00a651'

// PDF resolver
const pdfModules = import.meta.glob('../assets/pdf/*.pdf', { eager: true, query: '?url', import: 'default' })
function findPdf(keyword) {
  const entry = Object.entries(pdfModules).find(([p]) => p.includes(keyword))
  return entry ? entry[1] : null
}
const PDF_ATRACCION = findPdf('ATRACCION')

// Mapa imagen por id de beneficio
const BENEFICIO_IMGS = [colegiosImg, gimnasiosImg, jardinesImg, cooperativaImg]

// ── Reusable atoms ──────────────────────────────────────────────────────────
function Callout({ children }) {
  return <div className="uc-callout">{children}</div>
}

function Maxim({ children }) {
  return (
    <p className="uc-maxim">
      {children}
    </p>
  )
}

function ExternalBtn({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="uc-ext-btn"
    >
      {children} →
    </a>
  )
}

function PdfEmbed({ src, title }) {
  if (!src) return null
  return (
    <div className="uc-pdf-wrapper">
      <iframe src={src} title={title} className="uc-pdf" />
    </div>
  )
}

// ── Section: Acceso (banner) ────────────────────────────────────────────────
function SecAcceso({ bloque }) {
  return (
    <section className="uc-section">
      <div className="uc-banner">
        <img
          src={unicorporativaImg}
          alt="Portal Unicorporativa"
          className="uc-banner-img"
        />
        <div className="uc-banner-overlay">
          <p className="uc-banner-text">{bloque.titulo}</p>
          {bloque.nota && (
            <span className="uc-banner-badge">
              {bloque.nota}
            </span>
          )}
        </div>
      </div>
      {bloque.maxim && <Maxim>{bloque.maxim}</Maxim>}
      {bloque.fuente && (
        <div className="uc-actions">
          <ExternalBtn href={bloque.fuente}>Ir a Unicorporativa</ExternalBtn>
        </div>
      )}
    </section>
  )
}

// ── Section: Fechas (tabla) ─────────────────────────────────────────────────
function SecFechas({ bloque }) {
  return (
    <section className="uc-section">
      <h2 className="uc-section-title">{bloque.titulo}</h2>
      <div className="uc-table-wrapper">
        <table className="uc-table">
          <thead>
            <tr>
              <th>Periodo</th>
              <th>Actividad</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {bloque.table.map((row, i) => (
              <tr key={i}>
                <td>{row.periodo}</td>
                <td>{row.actividad}</td>
                <td className="uc-table-fecha">{row.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {bloque.maxim && <Maxim>{bloque.maxim}</Maxim>}
    </section>
  )
}

// ── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="lb-backdrop" onClick={onClose}>
      <button className="lb-close" onClick={onClose} aria-label="Cerrar">✕</button>
      <img
        src={src}
        alt={alt}
        className="lb-img"
        onClick={e => e.stopPropagation()}
      />
    </div>
  )
}

// ── Section: Beneficios (tarjetas con imagen) ───────────────────────────────
function SecBeneficios({ bloque }) {
  const [lightbox, setLightbox] = useState(null)

  return (
    <section className="uc-section">
      <h2 className="uc-section-title">{bloque.titulo}</h2>
      <div className="uc-beneficios-grid">
        {bloque.items.map((item, i) => (
          <div key={i} className="uc-beneficio-card">
            <div
              className="uc-beneficio-img-wrap"
              onClick={() => setLightbox({ src: BENEFICIO_IMGS[i], alt: `Beneficio ${i + 1}` })}
            >
              <img
                src={BENEFICIO_IMGS[i]}
                alt={`Beneficio ${i + 1}`}
                className="uc-beneficio-img"
              />
              <div className="uc-beneficio-zoom">Ver imagen</div>
            </div>
            <p className="uc-beneficio-text">{item}</p>
          </div>
        ))}
      </div>

      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  )
}

// ── Section: Atracción y selección (PDF + botón) ────────────────────────────
function SecAtraccion({ bloque }) {
  return (
    <section className="uc-section">
      <h2 className="uc-section-title">Atracción y selección</h2>
      <p className="uc-section-intro">{bloque.titulo}</p>
      <PdfEmbed src={PDF_ATRACCION} title="Manual módulo atracción y selección" />
      <div className="uc-actions">
        <ExternalBtn href={bloque.fuente}>Abrir documento original</ExternalBtn>
      </div>
    </section>
  )
}

// ── UnicorporativaTab ───────────────────────────────────────────────────────
function UnicorporativaTab({ data }) {
  const b = Object.fromEntries(data.bloques.map(bloque => [bloque.id, bloque]))

  return (
    <main className="news-page">
      <div className="container">
        <header className="news-header">
          <h1 className="news-title">{data.titulo}</h1>
          <p className="news-desc">{data.descripcion}</p>
        </header>
      </div>

      <div className="section">
        <div className="container uc-content">
          <SecAcceso    bloque={b['acceso']} />
          <SecFechas    bloque={b['fechas']} />
          <SecBeneficios bloque={b['beneficios']} />
          <SecAtraccion bloque={b['atraccion-seleccion']} />
        </div>
      </div>
    </main>
  )
}

// ── Tabs wrapper ────────────────────────────────────────────────────────────
const TABS = [
  { id: 'principal', label: 'Bienestar y Desarrollo', data: bienestarData },
  { id: 'tab2',      label: 'Unicorporativa',          data: bienestarTab2Data },
]

export default function Bienestar() {
  const [active, setActive] = useState('principal')
  const current = TABS.find(t => t.id === active)

  return (
    <>
      <nav className="bienestar-subtab-bar">
        <div className="container bienestar-subtab-inner">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`bienestar-subtab-btn${active === tab.id ? ' bienestar-subtab-btn--active' : ''}`}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {active === 'tab2'
        ? <UnicorporativaTab data={current.data} />
        : <StaticPage data={current.data} accentColor={ACCENT} />
      }
    </>
  )
}

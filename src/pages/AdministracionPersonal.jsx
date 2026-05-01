import { useState, useEffect, useRef } from 'react'
import StaticPage from './StaticPage'
import { administracionData, administracionTab2Data } from '../data/staticSections'
import './AdministracionPersonal.css'

const ACCENT = '#0C82B2'

// Resolve PDFs by keyword to avoid filename encoding issues
const pdfModules = import.meta.glob('../assets/pdf/*.pdf', { eager: true, query: '?url', import: 'default' })
function findPdf(keyword) {
  const entry = Object.entries(pdfModules).find(([p]) => p.includes(keyword))
  return entry ? entry[1] : null
}
const PDF_CERT      = findPdf('Instructivo-Generar')
const PDF_CESANTIAS_SOL = findPdf('Solicitud')
const PDF_CESANTIAS_LEG = findPdf('legalizaci')

function youtubeEmbedUrl(url) {
  const m = url.match(/(?:youtu\.be\/|[?&]v=)([A-Za-z0-9_-]{11})/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : null
}

// ── Section definitions for the sidebar nav ──────────────────────────────────
const NAV_SECTIONS = [
  { id: 'sec-certificados',  label: 'Certificados laborales' },
  { id: 'sec-detallado',     label: 'Certificado detallado' },
  { id: 'sec-tutoria',       label: 'Certificado tutoría' },
  { id: 'sec-contacto',      label: 'Contactos' },
  { id: 'sec-perfil',        label: 'Actualiza tu perfil' },
  { id: 'sec-cesantias',     label: 'Cesantías' },
]

// ── Small reusable pieces ─────────────────────────────────────────────────────
function SectionAnchor({ id, children, className = '' }) {
  return (
    <section id={id} className={`instructivo-section ${className}`}>
      {children}
    </section>
  )
}

function ItemsList({ items }) {
  return (
    <ul className="ti-items-list">
      {items.map((item, i) => (
        <li key={i} className="ti-item">
          <span className="ti-item-dot" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function Callout({ children, type = 'info' }) {
  return <div className={`ti-callout ti-callout--${type}`}>{children}</div>
}

function VideoEmbed({ url, title }) {
  const embedUrl = youtubeEmbedUrl(url)
  if (!embedUrl) return null
  return (
    <div className="ti-video-wrapper">
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="ti-video"
      />
    </div>
  )
}

function PdfEmbed({ src, title }) {
  if (!src) return null
  return (
    <div className="pdf-viewer-wrapper">
      <iframe src={src} title={title} className="pdf-viewer" />
    </div>
  )
}

function ExternalBtn({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="instructivo-btn"
    >
      {children} →
    </a>
  )
}

// ── Section renderers ─────────────────────────────────────────────────────────
function SecCertificados({ bloque }) {
  return (
    <SectionAnchor id="sec-certificados">
      <h2 className="ti-section-title">Certificados laborales</h2>
      <p className="ti-section-intro">{bloque.titulo}</p>
      <PdfEmbed src={PDF_CERT} title="Instructivo generación de certificados" />
      <div className="instructivo-actions">
        <ExternalBtn href={bloque.fuente}>Abrir documento original</ExternalBtn>
      </div>
    </SectionAnchor>
  )
}

function SecDetallado({ bloque }) {
  return (
    <SectionAnchor id="sec-detallado">
      <h2 className="ti-section-title">Certificado detallado</h2>
      <p className="ti-section-intro">{bloque.titulo}</p>
      <ItemsList items={bloque.items} />
    </SectionAnchor>
  )
}

function SecTutoria({ bloque }) {
  return (
    <SectionAnchor id="sec-tutoria">
      <h2 className="ti-section-title">Certificado de tutoría</h2>
      <p className="ti-section-intro">{bloque.titulo}</p>
      <ItemsList items={bloque.items} />
      {bloque.nota && (
        <Callout type="warning">
          <strong>Recuerda: </strong>{bloque.nota}
        </Callout>
      )}
    </SectionAnchor>
  )
}

function SecContacto({ bloque }) {
  const contacts = bloque.nombres.map((nombre, i) => ({
    nombre,
    correo: bloque.correos[i],
  }))
  return (
    <SectionAnchor id="sec-contacto">
      <h2 className="ti-section-title">{bloque.titulo}</h2>
      <div className="ti-contact-grid">
        {contacts.map((c) => (
          <div key={c.correo} className="ti-contact-card">
            <div className="ti-contact-avatar">
              {c.nombre.trim()[0]}
            </div>
            <p className="ti-contact-name">{c.nombre.trim()}</p>
            <a href={`mailto:${c.correo}`} className="ti-contact-email">
              {c.correo}
            </a>
          </div>
        ))}
      </div>
      <Callout type="info">
        <strong>{bloque.politica}: </strong>{bloque.description}
      </Callout>
    </SectionAnchor>
  )
}

function SecPerfil({ bloqueInvitation, bloqueVideo }) {
  return (
    <SectionAnchor id="sec-perfil">
      <h2 className="ti-section-title">{bloqueInvitation.titulo}</h2>
      <p className="ti-section-intro">{bloqueInvitation.description}</p>
      <ItemsList items={bloqueInvitation.items} />
      {bloqueInvitation.nota && (
        <Callout type="info">
          {bloqueInvitation.nota}
        </Callout>
      )}
      {bloqueInvitation.maxim && (
        <blockquote className="ti-maxim">
          {bloqueInvitation.maxim}
        </blockquote>
      )}
      <p className="ti-section-intro">{bloqueVideo.titulo}</p>
      <VideoEmbed url={bloqueVideo.fuentevideo} title="Cómo actualizar tu perfil en Talentos Innovadores" />
    </SectionAnchor>
  )
}

function SecCesantias({ bloquevideo, bloqueInstructivo }) {
  const cesantiasData = [
    {
      titulo: bloqueInstructivo.titulo[0],
      fuente: bloqueInstructivo.fuente[0],
      pdf: PDF_CESANTIAS_SOL,
    },
    {
      titulo: bloqueInstructivo.titulo[1],
      fuente: bloqueInstructivo.fuente[1],
      pdf: PDF_CESANTIAS_LEG,
    },
  ]

  return (
    <SectionAnchor id="sec-cesantias">
      <h2 className="ti-section-title">{bloquevideo.titulo}</h2>
      <VideoEmbed url={bloquevideo.fuente} title="Cómo gestionar tus cesantías" />

      <div className="ti-cesantias-pair">
        {cesantiasData.map((item, i) => (
          <div key={i} className="ti-cesantias-card">
            <h3 className="ti-cesantias-card-title">{item.titulo}</h3>
            <PdfEmbed src={item.pdf} title={item.titulo} />
            <div className="instructivo-actions">
              <ExternalBtn href={item.fuente}>Abrir documento original</ExternalBtn>
            </div>
          </div>
        ))}
      </div>
    </SectionAnchor>
  )
}

// ── Sidebar / pill nav ────────────────────────────────────────────────────────
function InstructivoNav({ activeId, onNav }) {
  return (
    <nav className="ti-nav" aria-label="Secciones del instructivo">
      <p className="ti-nav-label">En esta página</p>
      <ul className="ti-nav-list">
        {NAV_SECTIONS.map(sec => (
          <li key={sec.id}>
            <button
              className={`ti-nav-btn${activeId === sec.id ? ' ti-nav-btn--active' : ''}`}
              onClick={() => onNav(sec.id)}
            >
              {sec.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function InstructivoPills({ activeId, onNav }) {
  return (
    <div className="ti-pills-bar">
      <div className="ti-pills-inner">
        {NAV_SECTIONS.map(sec => (
          <button
            key={sec.id}
            className={`ti-pill${activeId === sec.id ? ' ti-pill--active' : ''}`}
            onClick={() => onNav(sec.id)}
          >
            {sec.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Main InstructivoTab ───────────────────────────────────────────────────────
function InstructivoTab({ data }) {
  const [activeId, setActiveId] = useState(NAV_SECTIONS[0].id)
  const observerRef = useRef(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    )
    NAV_SECTIONS.forEach(sec => {
      const el = document.getElementById(sec.id)
      if (el) observerRef.current.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [])

  function scrollTo(id) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const b = Object.fromEntries(data.bloques.map(b => [b.id, b]))

  return (
    <main className="news-page">
      <div className="container">
        <header className="news-header">
          <h1 className="news-title">{data.titulo}</h1>
          <p className="news-desc">{data.descripcion}</p>
        </header>
      </div>

      {/* Mobile pill nav */}
      <InstructivoPills activeId={activeId} onNav={scrollTo} />

      <div className="section">
        <div className="container ti-layout">
          {/* Desktop sidebar nav */}
          <InstructivoNav activeId={activeId} onNav={scrollTo} />

          {/* Content */}
          <div className="ti-content">
            <SecCertificados bloque={b['instructivo-pdf']} />
            <SecDetallado    bloque={b['recordatorio-uno']} />
            <SecTutoria      bloque={b['recordatorio-dos']} />
            <SecContacto     bloque={b['contacto']} />
            <SecPerfil
              bloqueInvitation={b['invitation']}
              bloqueVideo={b['profile-updated']}
            />
            <SecCesantias
              bloquevideo={b['cesantias-management']}
              bloqueInstructivo={b['instructivo-cesantias-management']}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

// ── Tabs wrapper ──────────────────────────────────────────────────────────────
const TABS = [
  { id: 'principal',   label: 'Talentos Innovadores', data: administracionData },
  { id: 'instructivo', label: 'Instructivo',           data: administracionTab2Data },
]

export default function AdministracionPersonal() {
  const [active, setActive] = useState('principal')
  const current = TABS.find(t => t.id === active)

  return (
    <>
      <nav className="subtab-bar">
        <div className="container subtab-inner">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`subtab-btn${active === tab.id ? ' subtab-btn--active' : ''}`}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {active === 'instructivo'
        ? <InstructivoTab data={current.data} />
        : <StaticPage data={current.data} accentColor={ACCENT} />
      }
    </>
  )
}

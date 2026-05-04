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

// ── PDF Drawer ────────────────────────────────────────────────────────────────
function PdfDrawer({ src, title, onClose }) {
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
    <div className="pdf-drawer-backdrop" onClick={onClose}>
      <div className="pdf-drawer-panel" onClick={e => e.stopPropagation()}>
        <div className="pdf-drawer-header">
          <span className="pdf-drawer-title">{title}</span>
          <button className="pdf-drawer-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <iframe src={src} title={title} className="pdf-drawer-iframe" />
      </div>
    </div>
  )
}

// ── Smart Document Card ───────────────────────────────────────────────────────
function SmartDocCard({ titulo, pdf, fuente, onOpenDrawer }) {
  return (
    <div className="ti-smart-doc-card">
      {pdf && (
        <div className="ti-smart-doc-preview" onClick={() => onOpenDrawer(pdf, titulo)}>
          <div className="ti-smart-doc-icon">📄</div>
          <div className="ti-smart-doc-hint">Ver documento</div>
        </div>
      )}
      <div className="ti-smart-doc-info">
        <p className="ti-smart-doc-title">{titulo}</p>
        <p className="ti-smart-doc-meta">PDF · Documentación oficial</p>
        <div className="ti-smart-doc-actions">
          {pdf && (
            <button className="ti-smart-doc-btn-primary" onClick={() => onOpenDrawer(pdf, titulo)}>
              Ver documento
            </button>
          )}
          {fuente && (
            <a href={fuente} target="_blank" rel="noopener noreferrer" className="ti-smart-doc-btn-secondary">
              Abrir original ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Section renderers ─────────────────────────────────────────────────────────
function SecCertificados({ bloque, onOpenDrawer }) {
  return (
    <SectionAnchor id="sec-certificados">
      <h2 className="ti-section-title">Certificados laborales</h2>
      <p className="ti-section-intro">{bloque.titulo}</p>
      <SmartDocCard titulo="Instructivo generación de certificados" pdf={PDF_CERT} fuente={bloque.fuente} onOpenDrawer={onOpenDrawer} />
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

function SecCesantias({ bloquevideo, bloqueInstructivo, onOpenDrawer }) {
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
          <SmartDocCard key={i} titulo={item.titulo} pdf={item.pdf} fuente={item.fuente} onOpenDrawer={onOpenDrawer} />
        ))}
      </div>
    </SectionAnchor>
  )
}

// ── Sidebar / pill nav ────────────────────────────────────────────────────────
function InstructivoNav({ activeId, onNav }) {
  const activeIndex = NAV_SECTIONS.findIndex(s => s.id === activeId)
  const progress = ((activeIndex + 1) / NAV_SECTIONS.length) * 100

  return (
    <nav className="ti-nav" aria-label="Secciones del instructivo">
      <p className="ti-nav-label">En esta página</p>
      <ul className="ti-nav-list">
        {NAV_SECTIONS.map((sec, i) => (
          <li key={sec.id}>
            <button
              className={`ti-nav-btn${activeId === sec.id ? ' ti-nav-btn--active' : ''}`}
              onClick={() => onNav(sec.id)}
            >
              <span className="ti-nav-index">{String(i + 1).padStart(2, '0')}</span>
              {sec.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="ti-nav-progress">
        <span className="ti-nav-progress-text">{activeIndex + 1} / {NAV_SECTIONS.length}</span>
        <div className="ti-nav-progress-bar">
          <div className="ti-nav-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
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
  const [drawer, setDrawer] = useState(null)
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

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ti-visible')
          obs.unobserve(entry.target)
        }
      }),
      { threshold: 0.06 }
    )
    NAV_SECTIONS.forEach(sec => {
      const el = document.getElementById(sec.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  function scrollTo(id) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openDrawer = (src, title) => setDrawer({ src, title })
  const b = Object.fromEntries(data.bloques.map(b => [b.id, b]))

  return (
    <main className="news-page">
      <div className="container">
        <header className="news-header">
          <h1 className="news-title">{data.titulo}</h1>
          <p className="news-desc">{data.descripcion}</p>
        </header>
      </div>

      <InstructivoPills activeId={activeId} onNav={scrollTo} />

      <div className="section">
        <div className="container ti-layout">
          <InstructivoNav activeId={activeId} onNav={scrollTo} />

          <div className="ti-content">
            <SecCertificados bloque={b['instructivo-pdf']} onOpenDrawer={openDrawer} />
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
              onOpenDrawer={openDrawer}
            />
          </div>
        </div>
      </div>

      {drawer && <PdfDrawer src={drawer.src} title={drawer.title} onClose={() => setDrawer(null)} />}
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

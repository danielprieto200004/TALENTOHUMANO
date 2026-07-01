import { memo, useCallback, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { IoCloseOutline, IoExpandOutline } from 'react-icons/io5'
import { BsClockHistory, BsListCheck, BsEnvelopeAt, BsWhatsapp, BsTelephone, BsHeadset } from 'react-icons/bs'
import StaticPage from './StaticPage'
import { bienestarData, bienestarTab2Data } from '../data/staticSections'
import unicorporativaImg from '../assets/img/unicorporativa-page.png'
import colegiosImg       from '../assets/img/colegios-minuto-de-dios.webp'
import gimnasiosImg      from '../assets/img/gimnasios.png'
import laOfrendaImg      from '../assets/img/la-ofrenda.png'
import cooperativaImg   from '../assets/img/cooperativa.png'
import './Bienestar.css'

const ACCENT = '#0c82b2'

// PDF resolver
const pdfModules = import.meta.glob('../assets/pdf/*.pdf', { eager: true, query: '?url', import: 'default' })
function findPdf(keyword) {
  const entry = Object.entries(pdfModules).find(([p]) => p.includes(keyword))
  return entry ? entry[1] : null
}
const PDF_ATRACCION = findPdf('ATRACCION')

// Mapa imagen por id de beneficio
const BENEFICIO_IMGS = [colegiosImg, gimnasiosImg, laOfrendaImg, cooperativaImg]

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
  if (!bloque) return null
  return (
    <section id="uc-acceso" className="uc-section uc-section-anim">
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
  if (!bloque) return null
  return (
    <section id="uc-fechas" className="uc-section uc-section-anim">
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
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div className={`sst-lb-backdrop ${loaded ? 'is-active' : ''}`} onClick={onClose}>
      <button className="sst-lb-close" onClick={onClose} aria-label="Cerrar">
        <IoCloseOutline />
      </button>
      <div className="sst-lb-container" onClick={e => e.stopPropagation()}>
        {!loaded && <div className="sst-lb-loader" />}
        <img
          src={src}
          alt={alt}
          className={`sst-lb-img ${loaded ? 'is-loaded' : ''}`}
          onLoad={() => setLoaded(true)}
        />
        {loaded && alt && (
          <div className="sst-lb-caption">
            <IoExpandOutline className="sst-lb-caption-icon" />
            <span>{alt}</span>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

// ── PDF Drawer ──────────────────────────────────────────────────────────────
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

// ── Smart Document Card ─────────────────────────────────────────────────────
function SmartDocCard({ titulo, pdf, fuente, onOpenDrawer }) {
  return (
    <div className="smart-doc-card uc-smart-doc-card">
      {pdf && (
        <div className="smart-doc-preview" onClick={() => onOpenDrawer(pdf, titulo)}>
          <div className="smart-doc-preview-icon">📄</div>
          <div className="smart-doc-preview-hint">Ver documento</div>
        </div>
      )}
      <div className="smart-doc-info">
        <p className="smart-doc-title">{titulo}</p>
        <p className="smart-doc-meta">PDF · Documentación oficial</p>
        <div className="smart-doc-actions">
          {pdf && (
            <button className="smart-doc-btn-primary uc-doc-btn-primary" onClick={() => onOpenDrawer(pdf, titulo)}>
              Ver documento
            </button>
          )}
          {fuente && (
            <a href={fuente} target="_blank" rel="noopener noreferrer" className="smart-doc-btn-secondary">
              Abrir original ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Section: Beneficios (tarjetas con imagen) ───────────────────────────────
const SecBeneficios = memo(function SecBeneficios({ bloque, onOpenImage }) {
  if (!bloque) return null
  return (
    <section id="uc-beneficios" className="uc-section uc-section-anim">
      <h2 className="uc-section-title">{bloque.titulo}</h2>
      <div className="uc-beneficios-grid">
        {bloque.items.map((item, i) => (
          <div
            key={i}
            className="uc-beneficio-card"
            onClick={() => onOpenImage(BENEFICIO_IMGS[i], item)}
          >
            <div className="uc-beneficio-img-wrap">
              <img
                src={BENEFICIO_IMGS[i]}
                alt={item}
                className="uc-beneficio-img"
                loading="lazy"
              />
              <div className="uc-beneficio-zoom">
                <IoExpandOutline />
                <span>Ver imagen</span>
              </div>
            </div>
            <p className="uc-beneficio-text">{item}</p>
          </div>
        ))}
      </div>
    </section>
  )
})

// ── Section: Atracción y selección (PDF + botón) ────────────────────────────
function SecAtraccion({ bloque, onOpenDrawer }) {
  if (!bloque) return null
  return (
    <section id="uc-atraccion" className="uc-section uc-section-anim">
      <h2 className="uc-section-title">Atracción y selección</h2>
      <p className="uc-section-intro">{bloque.titulo}</p>
      <SmartDocCard titulo="Manual módulo atracción y selección" pdf={PDF_ATRACCION} fuente={bloque.fuente} onOpenDrawer={onOpenDrawer} />
    </section>
  )
}

// ── Section: Contactos ──────────────────────────────────────────────────────
const CONTACTOS_DATA = [
  { nombre: 'ALBA MILENA LEON CAÑAVERAL', cargo: 'Coordinadora de Bienestar y Desarrollo', correo: 'alba.leon@uniminuto.edu', inicial: 'AM' },
  { nombre: 'ALISON ESTEISY OCAMPO CABUYA', cargo: 'Profesional de Bienestar y Desarrollo', correo: 'alison.ocampo.c@uniminuto.edu', inicial: 'AO' },
  { nombre: 'JOSE MISAEL HUERTAS HERNANDEZ', cargo: 'Profesional de Bienestar y Desarrollo', correo: 'jose.huertas.h@uniminuto.edu', inicial: 'JH' },
  { nombre: 'WENDY DAYANA MOTTA GUTIERREZ', cargo: 'Profesional de Bienestar y Desarrollo', correo: 'wendy.motta@uniminuto.edu', inicial: 'WM' }
]

function SecContactos({ bloque }) {
  return (
    <section id="uc-contactos" className="uc-section uc-section-anim">
      <h2 className="uc-section-title">Contactos Bienestar y Desarrollo</h2>
      <p className="uc-section-intro" style={{ marginBottom: '24px' }}>
        Para cualquier duda, solicitud o acompañamiento, ponte en contacto con nuestro equipo de profesionales:
      </p>
      
      <div className="uc-contactos-grid">
        {CONTACTOS_DATA.map((c) => (
          <div key={c.correo} className="uc-contacto-card">
            <div className="uc-contacto-avatar">
              {c.inicial}
            </div>
            <h3 className="uc-contacto-name">{c.nombre}</h3>
            <p className="uc-contacto-role">{c.cargo}</p>
            <span className="uc-contacto-email">{c.correo}</span>
            <a href={`mailto:${c.correo}`} className="uc-contacto-mail-btn">
              Enviar correo →
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

function SecSeguroExequial({ bloque }) {
  if (!bloque) return null
  return (
    <section id="uc-seguro-exequial" className="uc-section uc-section-anim">
      <h2 className="uc-section-title">Seguro Exequial La Ofrenda S.A.</h2>
      
      <div className="la-ofrenda-alert-card">
        <div className="la-ofrenda-alert-icon"><BsClockHistory /></div>
        <div className="la-ofrenda-alert-info">
          <h3>Plazo de Registro Ampliado</h3>
          <p>La fecha límite para actualizar tu grupo familiar y mascotas es el <strong>15 de mayo de 2026</strong>. Si no realizas modificaciones antes de esta fecha, tu plan quedará asignado automáticamente bajo la cobertura base (Titular y primer grado de consanguinidad).</p>
        </div>
      </div>

      <div className="la-ofrenda-plans-grid">
        <div className="la-ofrenda-plan-card">
          <span className="la-ofrenda-plan-tag">Opción 1</span>
          <h4>Familiar + Mascota</h4>
          <p className="la-ofrenda-plan-desc">Titular + 8 beneficiarios + 1 mascota.</p>
        </div>
        <div className="la-ofrenda-plan-card">
          <span className="la-ofrenda-plan-tag">Opción 2</span>
          <h4>Familiar Extendido</h4>
          <p className="la-ofrenda-plan-desc">Titular + 9 beneficiarios.</p>
        </div>
      </div>

      <div className="la-ofrenda-steps-box">
        <h3>
          <BsListCheck style={{ marginRight: '10px', verticalAlign: 'middle', color: '#0c82b2' }} />
          Datos requeridos para el registro:
        </h3>
        <div className="la-ofrenda-step">
          <span className="la-ofrenda-step-num">1</span>
          <div className="la-ofrenda-step-content">
            <strong>Datos del colaborador UNIMINUTO</strong>
            <p>Nombre completo y número de cédula.</p>
          </div>
        </div>
        <div className="la-ofrenda-step">
          <span className="la-ofrenda-step-num">2</span>
          <div className="la-ofrenda-step-content">
            <strong>Si deseas registrar beneficiarios</strong>
            <p>Nombre completo, parentesco, fecha de nacimiento y número del documento de identidad.</p>
          </div>
        </div>
        <div className="la-ofrenda-step">
          <span className="la-ofrenda-step-num">3</span>
          <div className="la-ofrenda-step-content">
            <strong>Si deseas registrar beneficiarios + mascota</strong>
            <p>Además de la información anterior, incluir: Nombre de la mascota, raza, tipo (canino, felino o ave), edad (máximo 10 años), peso, color y características particulares.</p>
          </div>
        </div>
      </div>

      <div className="la-ofrenda-channels-box">
        <h3>
          <BsHeadset style={{ marginRight: '10px', verticalAlign: 'middle', color: '#0c82b2' }} />
          Canales de Atención La Ofrenda:
        </h3>
        <div className="la-ofrenda-channels-grid">
          <a href="mailto:coordinador.nacional@laofrendasa.com" className="la-ofrenda-channel-card">
            <span className="la-ofrenda-channel-icon"><BsEnvelopeAt /></span>
            <strong>Correo Electrónico</strong>
            <p>coordinador.nacional@laofrendasa.com</p>
          </a>
          <a href="https://wa.me/573227619382" target="_blank" rel="noopener noreferrer" className="la-ofrenda-channel-card">
            <span className="la-ofrenda-channel-icon"><BsWhatsapp /></span>
            <strong>WhatsApp / Celular</strong>
            <p>322 761 9382</p>
          </a>
          <a href="tel:018000180828" className="la-ofrenda-channel-card">
            <span className="la-ofrenda-channel-icon"><BsTelephone /></span>
            <strong>Línea Gratuita Nacional</strong>
            <p>018000 180828</p>
          </a>
        </div>
      </div>
    </section>
  )
}

// ── Section nav ─────────────────────────────────────────────────────────────
const UC_SECTIONS = [
  { id: 'uc-acceso',     label: 'Unicorporativa' },
  { id: 'uc-fechas',     label: 'Fechas clave' },
  { id: 'uc-beneficios', label: 'Beneficios' },
  { id: 'uc-seguro-exequial', label: 'Seguro Exequial' },
  { id: 'uc-atraccion',  label: 'Atracción y Selección' },
  { id: 'uc-contactos',  label: 'Contactos' },
]

function UcStickyNav({ activeId, onNav }) {
  return (
    <div className="uc-sticky-nav">
      <div className="uc-sticky-nav-inner">
        {UC_SECTIONS.map((sec, i) => (
          <button
            key={sec.id}
            className={`uc-sticky-nav-btn${activeId === sec.id ? ' uc-sticky-nav-btn--active' : ''}`}
            onClick={() => onNav(sec.id)}
          >
            <span className="uc-sticky-nav-index">{String(i + 1).padStart(2, '0')}</span>
            {sec.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── UnicorporativaTab ───────────────────────────────────────────────────────
function UnicorporativaTab({ data }) {
  const [activeId, setActiveId] = useState(UC_SECTIONS[0].id)
  const [drawer, setDrawer] = useState(null)
  const [lightbox, setLightbox] = useState(null)
  const b = Object.fromEntries(data.bloques.map(bloque => [bloque.id, bloque]))

  useEffect(() => {
    const navObs = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) setActiveId(entry.target.id)
      }),
      { rootMargin: '-100px 0px -50% 0px', threshold: 0 }
    )
    UC_SECTIONS.forEach(sec => {
      const el = document.getElementById(sec.id)
      if (el) navObs.observe(el)
    })
    return () => navObs.disconnect()
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('uc-visible')
          obs.unobserve(entry.target)
        }
      }),
      { threshold: 0.06 }
    )
    UC_SECTIONS.forEach(sec => {
      const el = document.getElementById(sec.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openDrawer = useCallback((src, title) => setDrawer({ src, title }), [])
  const openImage  = useCallback((src, alt)   => setLightbox({ src, alt }), [])

  return (
    <main className="news-page">
      <div className="container">
        <header className="news-header">
          <h1 className="news-title">{data.titulo}</h1>
          <p className="news-desc">{data.descripcion}</p>
        </header>
      </div>

      <UcStickyNav activeId={activeId} onNav={scrollTo} />

      <div className="section">
        <div className="container uc-content">
          <SecAcceso    bloque={b['acceso']} />
          <SecFechas    bloque={b['fechas']} />
          <SecBeneficios bloque={b['beneficios']} onOpenImage={openImage} />
          <SecSeguroExequial bloque={b['seguro-exequial']} />
          <SecAtraccion bloque={b['atraccion-seleccion']} onOpenDrawer={openDrawer} />
          <SecContactos bloque={b['contactos-bienestar']} />
        </div>
      </div>

      {drawer && <PdfDrawer src={drawer.src} title={drawer.title} onClose={() => setDrawer(null)} />}
      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
    </main>
  )
}

// ── Tabs wrapper ────────────────────────────────────────────────────────────
const TABS = [
  { id: 'tab2',      label: 'Unicorporativa',          data: bienestarTab2Data },
]

export default function Bienestar() {
  const [active, setActive] = useState('tab2')
  const current = TABS.find(t => t.id === active)

  return (
    <>
      {TABS.length > 1 && (
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
      )}

      {active === 'tab2'
        ? <UnicorporativaTab data={current.data} />
        : <StaticPage data={current.data} accentColor={ACCENT} />
      }
    </>
  )
}

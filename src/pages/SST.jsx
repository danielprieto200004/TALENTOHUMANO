import { useState, useEffect, useRef } from 'react'
import StaticPage from './StaticPage'
import { sstData, sstTab2Data } from '../data/staticSections'

// ── Image imports ─────────────────────────────────────────────────────────────
import gestEmergenciasImg     from '../assets/img/gestion-emergencias.jpg'
import invitacionBrigadistaImg from '../assets/img/invitation-brigadista.jpg'
import encuentroBrigadasImg   from '../assets/img/encuentro-brigadas-uniminuto.jpg'
import gestionRiesgosImg      from '../assets/img/gestion-riesgos.jpg'
import gestionAmbientalImg    from '../assets/img/gestion-ambiental.jpg'
import saludImg               from '../assets/img/salud.jpg'
import saludRespirImg         from '../assets/img/salud-enfermedades-respiratorias.jpg'
import saludGastroImg         from '../assets/img/salud-enfermedades-gastrointestinales.jpg'
import induccionImg           from '../assets/img/induccion-reinduccion.jpg'
import induccionPrevImg       from '../assets/img/induccion-reinduccion-previsualizacion.png'
import salidasCampoImg        from '../assets/img/salidas-a-campo.jpg'
import salidasVideoImg        from '../assets/img/salidas-a-campo-video.png'

import './SST.css'

const ACCENT = '#0C82B2'

// ── PDF resolver ──────────────────────────────────────────────────────────────
const pdfModules = import.meta.glob('../assets/pdf/*.pdf', { eager: true, query: '?url', import: 'default' })
function findPdf(keyword) {
  const entry = Object.entries(pdfModules).find(([p]) => p.toLowerCase().includes(keyword.toLowerCase()))
  return entry ? entry[1] : null
}
const PDF_POLITICA   = findPdf('POLITICA_DE_GESTION')
const PDF_RESOLUCION = findPdf('2638-2023')
const PDF_ROLES      = findPdf('Roles y Responsabilidades')
const PDF_COPASST    = findPdf('2652')
const PDF_DECALOGO   = findPdf('autocuidado')
const PDF_VIAL       = findPdf('Seguridad vial')
const PDF_RECLUSION  = findPdf('reclusin') || findPdf('establecimientos')
const PDF_SALIDAS    = findPdf('salidas de campo')

// ── YouTube helper ────────────────────────────────────────────────────────────
function youtubeEmbedUrl(url) {
  const m = url.match(/(?:youtu\.be\/|[?&]v=)([A-Za-z0-9_-]{11})/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : null
}

// ── Nav sections ──────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'sec-politica',    label: 'Política SG-SSTGA' },
  { id: 'sec-resolucion',  label: 'Resoluciones y Roles' },
  { id: 'sec-contacto',    label: 'Contactos SSTGA' },
  { id: 'sec-emergencias', label: 'Gestión de Emergencias' },
  { id: 'sec-riesgos',     label: 'Gestión de Riesgos' },
  { id: 'sec-ambiental',   label: 'Gestión Ambiental' },
  { id: 'sec-salud',       label: 'Salud' },
  { id: 'sec-induccion',   label: 'Inducción y Reinducción' },
  { id: 'sec-salidas',     label: 'Salidas a Campo' },
  { id: 'sec-vial',        label: 'Seguridad Vial' },
]

// ── Lightbox ──────────────────────────────────────────────────────────────────
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
    <div className="sst-lb-backdrop" onClick={onClose}>
      <button className="sst-lb-close" onClick={onClose} aria-label="Cerrar">✕</button>
      <img src={src} alt={alt} className="sst-lb-img" onClick={e => e.stopPropagation()} />
    </div>
  )
}

// ── Atoms ─────────────────────────────────────────────────────────────────────
function ProfSection({ id, children }) {
  return (
    <section id={id} className="prof-section" style={{ scrollMarginTop: '24px' }}>
      {children}
    </section>
  )
}

function ProfTitle({ children }) {
  return <h2 className="prof-title">{children}</h2>
}

function ProfSubtitle({ children }) {
  return <h3 className="prof-subtitle">{children}</h3>
}

function ProfText({ children }) {
  return <p className="prof-text">{children}</p>
}

function ProfCallout({ children, type = 'info' }) {
  return (
    <div className={`prof-callout prof-callout--${type}`}>
      {children}
    </div>
  )
}

function ProfMaxim({ children }) {
  return (
    <p className="prof-maxim">
      {children}
    </p>
  )
}

function ProfBanner({ src, alt }) {
  return (
    <div className="prof-banner">
      <img src={src} alt={alt} className="prof-banner-img" />
    </div>
  )
}

function ProfItemsList({ items }) {
  return (
    <ul className="prof-items-list">
      {items.map((item, i) => (
        <li key={i} className="prof-item">
          <span className="prof-item-dot" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function ProfPdf({ src, title }) {
  if (!src) return null
  return (
    <div className="prof-pdf-wrapper">
      <iframe src={src} title={title} className="prof-pdf" />
    </div>
  )
}

function ProfBtn({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="prof-btn">
      {children} →
    </a>
  )
}

function ProfVideoEmbed({ url, title }) {
  const embedUrl = youtubeEmbedUrl(url)
  if (!embedUrl) return null
  return (
    <div className="prof-video-wrapper">
      <iframe src={embedUrl} title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen className="prof-video" />
    </div>
  )
}

function ProfActions({ children }) {
  return <div className="prof-actions">{children}</div>
}

// ── PDF card (title + embed + button stacked) ─────────────────────────────────
function PdfCard({ titulo, pdf, fuente }) {
  return (
    <div className="prof-pdf-card">
      <ProfSubtitle>{titulo}</ProfSubtitle>
      <ProfPdf src={pdf} title={titulo} />
      <ProfActions>
        <ProfBtn href={fuente}>Abrir documento original</ProfBtn>
      </ProfActions>
    </div>
  )
}

// ── Section renderers ─────────────────────────────────────────────────────────

function SecPolitica({ b }) {
  return (
    <ProfSection id="sec-politica">
      <ProfTitle>{b.titulo}</ProfTitle>
      <ProfPdf src={PDF_POLITICA} title={b.titulo} />
      <ProfActions>
        <ProfBtn href={b.fuente}>Abrir documento original</ProfBtn>
      </ProfActions>
    </ProfSection>
  )
}

function SecResolucion({ bRes, bRoles, bCopasst }) {
  return (
    <ProfSection id="sec-resolucion">
      <ProfTitle>Resoluciones y Roles</ProfTitle>
      <div className="prof-stack">
        <PdfCard titulo={bRes.titulo}    pdf={PDF_RESOLUCION} fuente={bRes.fuente} />
        <PdfCard titulo={bRoles.titulo}  pdf={PDF_ROLES}      fuente={bRoles.fuente} />
        <PdfCard titulo={bCopasst.titulo} pdf={PDF_COPASST}   fuente={bCopasst.fuente} />
      </div>
      {bCopasst.nota && (
        <ProfCallout type="info">{bCopasst.nota}</ProfCallout>
      )}
    </ProfSection>
  )
}

function SecContacto({ b }) {
  const contacts = b.responsable.map((rol, i) => ({
    rol,
    correo: b.correos[i],
  }))
  return (
    <ProfSection id="sec-contacto">
      <ProfTitle>{b.titulo}</ProfTitle>
      <div className="prof-contact-grid">
        {contacts.map((c) => (
          <div key={c.correo} className="prof-contact-card">
            <div className="prof-contact-avatar">
              {c.correo[0].toUpperCase()}
            </div>
            <p className="prof-contact-rol">{c.rol}</p>
            <a href={`mailto:${c.correo}`} className="prof-contact-email">
              {c.correo}
            </a>
          </div>
        ))}
      </div>
    </ProfSection>
  )
}

function SecEmergencias({ bGest, bInv, bEncuentro }) {
  const [lightbox, setLightbox] = useState(null)

  return (
    <ProfSection id="sec-emergencias">
      <ProfTitle>Gestión de Emergencias</ProfTitle>

      {/* Agradecimiento brigadistas */}
      <div className="prof-subsection">
        <ProfMaxim>
          <b>{bGest.subtitulo[0]}</b>
          {bGest.texto[0]}
        </ProfMaxim>
        <ProfSubtitle>{bGest.subtitulo[1]}</ProfSubtitle>
        <ProfText>{bGest.texto[1]}</ProfText>
        <ProfBanner src={gestEmergenciasImg} alt="Gestión de emergencias" />
      </div>

      {/* Invitación brigadistas */}
      <div className="prof-subsection">
        <ProfText>{bInv.titulo}</ProfText>
        <ProfActions>
          <ProfBtn href={bInv.fuente}>Completar formulario de brigada</ProfBtn>
        </ProfActions>
        <div
          className="prof-img-card prof-img-zoomable"
          onClick={() => setLightbox({ src: invitacionBrigadistaImg, alt: 'Únete a la brigada' })}
        >
          <img src={invitacionBrigadistaImg} alt="Únete a la brigada" className="prof-img-full" />
          <div className="prof-img-zoom-hint">Ver imagen</div>
        </div>
      </div>

      {/* Encuentro brigadas */}
      <div className="prof-subsection">
        <ProfSubtitle>{bEncuentro.titulo}</ProfSubtitle>
        <div
          className="prof-img-card prof-img-zoomable"
          onClick={() => setLightbox({ src: encuentroBrigadasImg, alt: 'Encuentro de brigadas UNIMINUTO' })}
        >
          <img src={encuentroBrigadasImg} alt="Encuentro de brigadas UNIMINUTO" className="prof-img-full" />
          <div className="prof-img-zoom-hint">Ver imagen</div>
        </div>
        {bEncuentro.nota && (
          <ProfCallout type="info">{bEncuentro.nota}</ProfCallout>
        )}
        <ProfActions>
          <ProfBtn href={bEncuentro.fuente}>Consultar planes de emergencia</ProfBtn>
        </ProfActions>
        {bEncuentro.maxim && <ProfMaxim>{bEncuentro.maxim}</ProfMaxim>}
      </div>

      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
    </ProfSection>
  )
}

function SecRiesgos({ bBanner, bUno, bDos, bMatrices }) {
  return (
    <ProfSection id="sec-riesgos">
      <ProfTitle>{bBanner.titulo}</ProfTitle>
      <ProfBanner src={gestionRiesgosImg} alt="Gestión de riesgos" />

      {/* Accidente de trabajo */}
      <div className="prof-subsection">
        <ProfSubtitle>{bUno.titulo}</ProfSubtitle>
        <ProfText>{bUno.texto}</ProfText>
        <ProfSubtitle>{bUno.subtitulo}</ProfSubtitle>
        <ProfItemsList items={bUno.items} />
      </div>

      {/* Prevención */}
      <div className="prof-subsection">
        <ProfSubtitle>{bDos.titulo}</ProfSubtitle>
        <ProfSubtitle>{bDos.subtitulo}</ProfSubtitle>
        <ProfText>{bDos.texto}</ProfText>
        <ProfSubtitle>{bDos.subtitulodos}</ProfSubtitle>
        <ProfText>{bDos.textodos}</ProfText>
        {bDos.maxim && <ProfMaxim>{bDos.maxim}</ProfMaxim>}
      </div>

      {/* Matrices */}
      <div className="prof-subsection">
        <ProfSubtitle>{bMatrices.titulo}</ProfSubtitle>
        <ProfText>{bMatrices.texto}</ProfText>
        {bMatrices.nota && (
          <ProfCallout type="info">{bMatrices.nota}</ProfCallout>
        )}
        <ProfActions>
          <ProfBtn href={bMatrices.fuente}>Consultar matrices de peligro</ProfBtn>
        </ProfActions>
      </div>
    </ProfSection>
  )
}

function SecAmbiental({ b }) {
  return (
    <ProfSection id="sec-ambiental">
      <ProfTitle>{b.titulo}</ProfTitle>
      <ProfBanner src={gestionAmbientalImg} alt="Gestión ambiental" />
      {b.nota && <ProfCallout type="green">{b.nota}</ProfCallout>}
      <div className="prof-subsection">
        <ProfVideoEmbed url={b.fuente} title="Ahorra energía con una pequeña acción" />
        <ProfSubtitle>{b.subtitulo}</ProfSubtitle>
        <ProfText>{b.texto}</ProfText>
        {b.maxim && <ProfMaxim>{b.maxim}</ProfMaxim>}
      </div>
    </ProfSection>
  )
}

function SecSalud({ b }) {
  const [lightbox, setLightbox] = useState(null)

  return (
    <ProfSection id="sec-salud">
      <ProfTitle>{b.titulo}</ProfTitle>
      <ProfBanner src={saludImg} alt="Salud" />
      <div className="prof-subsection">
        <ProfText>{b.texto}</ProfText>
        {b.maxim && <ProfMaxim>{b.maxim}</ProfMaxim>}
      </div>

      {/* Tips con imagen */}
      <div className="prof-tips-grid">
        {[
          { label: b.tips[0], img: saludRespirImg },
          { label: b.tips[1], img: saludGastroImg },
        ].map((tip, i) => (
          <div
            key={i}
            className="prof-tip-card prof-img-zoomable"
            onClick={() => setLightbox({ src: tip.img, alt: tip.label })}
          >
            <img src={tip.img} alt={tip.label} className="prof-tip-img" />
            <div className="prof-img-zoom-hint">Ver imagen</div>
            <p className="prof-tip-label">{tip.label}</p>
          </div>
        ))}
      </div>

      {/* Vapeadores */}
      <div className="prof-subsection">
        <ProfSubtitle>{b.subtitulo}</ProfSubtitle>
        <ProfText>{b.textodos}</ProfText>
        <ProfSubtitle>{b.subtitulodos}</ProfSubtitle>
        <ProfItemsList items={b.items} />
      </div>

      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
    </ProfSection>
  )
}

function SecInduccion({ b }) {
  return (
    <ProfSection id="sec-induccion">
      <ProfTitle>{b.titulo}</ProfTitle>
      <ProfBanner src={induccionImg} alt="Inducción y reinducción" />
      {b.nota && <ProfCallout type="info">{b.nota}</ProfCallout>}
      <div className="prof-preview-img-wrap">
        <img src={induccionPrevImg} alt="Vista previa inducción" className="prof-preview-img" />
      </div>
      <ProfActions>
        <ProfBtn href={b.fuente}>Abrir documento</ProfBtn>
      </ProfActions>
    </ProfSection>
  )
}

function SecSalidas({ b }) {
  return (
    <ProfSection id="sec-salidas">
      <ProfTitle>{b.titulo}</ProfTitle>
      <ProfBanner src={salidasCampoImg} alt="Salidas a campo" />
      {b.nota && <ProfCallout type="info">{b.nota}</ProfCallout>}
      <div className="prof-subsection">
        <ProfPdf src={PDF_DECALOGO} title="Decálogo de autocuidado en salidas a campo" />
        <ProfActions>
          <ProfBtn href={b.fuente}>Abrir decálogo original</ProfBtn>
        </ProfActions>
      </div>
      {/* Video requiere autenticación — se muestra imagen + botón */}
      <div className="prof-subsection">
        <div className="prof-video-thumb">
          <img src={salidasVideoImg} alt="Video decálogo de autocuidado" className="prof-video-thumb-img" />
          <a href={b.fuentedos} target="_blank" rel="noopener noreferrer"
             className="prof-video-play-btn">
            Ver video
          </a>
        </div>
      </div>
    </ProfSection>
  )
}

function SecVial({ b }) {
  const docs = [
    { titulo: b.titulo,      pdf: PDF_VIAL,     fuente: b.fuente },
    { titulo: b.titulodos,   pdf: PDF_RECLUSION, fuente: b.fuentedos },
    { titulo: b.titulotres,  pdf: PDF_SALIDAS,   fuente: b.fuentetres },
  ]
  return (
    <ProfSection id="sec-vial">
      <ProfTitle>Seguridad Vial y Actores Viales</ProfTitle>
      <ProfText>{b.texto}</ProfText>
      <div className="prof-stack">
        {docs.map((doc, i) => (
          <PdfCard key={i} titulo={doc.titulo} pdf={doc.pdf} fuente={doc.fuente} />
        ))}
      </div>
    </ProfSection>
  )
}

// ── Sidebar nav ───────────────────────────────────────────────────────────────
function ProfNav({ activeId, onNav }) {
  return (
    <nav className="prof-nav" aria-label="Secciones de profundización">
      <p className="prof-nav-label">En esta página</p>
      <ul className="prof-nav-list">
        {NAV_SECTIONS.map(sec => (
          <li key={sec.id}>
            <button
              className={`prof-nav-btn${activeId === sec.id ? ' prof-nav-btn--active' : ''}`}
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

function ProfPills({ activeId, onNav }) {
  return (
    <div className="prof-pills-bar">
      <div className="prof-pills-inner">
        {NAV_SECTIONS.map(sec => (
          <button
            key={sec.id}
            className={`prof-pill${activeId === sec.id ? ' prof-pill--active' : ''}`}
            onClick={() => onNav(sec.id)}
          >
            {sec.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── ProfundizacionTab ─────────────────────────────────────────────────────────
function ProfundizacionTab({ data }) {
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
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const b = Object.fromEntries(data.bloques.map(bloque => [bloque.id, bloque]))

  return (
    <main className="news-page">
      <div className="container">
        <header className="news-header">
          <h1 className="news-title">{data.titulo}</h1>
          <p className="news-desc">{data.descripcion}</p>
        </header>
      </div>

      <ProfPills activeId={activeId} onNav={scrollTo} />

      <div className="section">
        <div className="container prof-layout">
          <ProfNav activeId={activeId} onNav={scrollTo} />
          <div className="prof-content">
            <SecPolitica    b={b['politica']} />
            <SecResolucion  bRes={b['resolucion']} bRoles={b['roles-responsabilidades']} bCopasst={b['comite-paritario']} />
            <SecContacto    b={b['contacto']} />
            <SecEmergencias bGest={b['gestion-emergencias']} bInv={b['invitation-brigadistas']} bEncuentro={b['encuentro-brigadas-uniminuto']} />
            <SecRiesgos     bBanner={b['gestion-riesgos']} bUno={b['gestion-riesgos-uno']} bDos={b['gestion-riesgos-dos']} bMatrices={b['matrices-de-peligro']} />
            <SecAmbiental   b={b['gestion-ambiental']} />
            <SecSalud       b={b['salud']} />
            <SecInduccion   b={b['induccion-reinduccion']} />
            <SecSalidas     b={b['salidas-a-campo']} />
            <SecVial        b={b['seguridad-actores-viales']} />
          </div>
        </div>
      </div>
    </main>
  )
}

// ── Tabs wrapper ──────────────────────────────────────────────────────────────
const TABS = [
  { id: 'principal', label: 'SG-SSTGA',       data: sstData },
  { id: 'tab2',      label: 'Profundización',  data: sstTab2Data },
]

export default function SST() {
  const [active, setActive] = useState('principal')
  const current = TABS.find(t => t.id === active)

  return (
    <>
      <nav className="sst-subtab-bar">
        <div className="container sst-subtab-inner">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`sst-subtab-btn${active === tab.id ? ' active' : ''}`}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {active === 'tab2'
        ? <ProfundizacionTab data={current.data} />
        : <StaticPage data={current.data} accentColor={ACCENT} />
      }
    </>
  )
}

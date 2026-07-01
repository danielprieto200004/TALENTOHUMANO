import { useState, useRef } from 'react'
import './ShareButton.css'

export default function ShareButton({ noticia }) {
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const dropdownRef = useRef(null)

  // Use the correct path for the news page which is /noticias
  const newsUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/noticias?id=${noticia.id}` 
    : `/noticias?id=${noticia.id}`

  const title = noticia.titulo || 'Comunicado'
  const excerpt = noticia.resumen || (noticia.cuerpo ? noticia.cuerpo.slice(0, 150) + '...' : '')
  
  // Tono más profesional para compartir
  const professionalIntro = 'Hola, te comparto esta información importante de Talento Humano:'
  const fullTextToShare = `${professionalIntro}\n\n${title}\n${excerpt}`
  const clipboardText = `${fullTextToShare}\n\nPuedes leer la noticia completa aquí: ${newsUrl}`
  
  const encodedText = encodeURIComponent(fullTextToShare)
  const encodedUrl = encodeURIComponent(newsUrl)
  const encodedTitle = encodeURIComponent(title)

  const copyLink = async () => {
    try {
      // Copiar el texto completo con formato en lugar de solo la URL
      await navigator.clipboard.writeText(clipboardText)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowMenu(false)
      }, 2000)
    } catch (err) {
      alert('No se pudo copiar el enlace')
    }
  }

  return (
    <div className="share-container">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="share-btn-main"
        title="Compartir publicación"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>

      {showMenu && (
        <>
          <div className="share-menu-backdrop" onClick={() => setShowMenu(false)} />
          <div className="share-dropdown-menu">
            <button onClick={copyLink} className="share-menu-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              {copied ? '¡Copiado!' : 'Copiar vínculo'}
            </button>
            
            <hr className="share-menu-divider" />

            <a
              href={`mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0AEnlace: ${encodedUrl}`}
              className="share-menu-item"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Microsoft Outlook
            </a>

            <a
              href={`https://teams.microsoft.com/share?href=${encodedUrl}&msgText=${encodedText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-menu-item"
            >
              {/* Teams custom simplified SVG */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c0 .28-.22.5-.5.5h-1c-.28 0-.5-.22-.5-.5v-4c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v4zm0-6.5c0 .28-.22.5-.5.5h-1c-.28 0-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v1z" />
              </svg>
              Microsoft Teams
            </a>
          </div>
        </>
      )}
    </div>
  )
}

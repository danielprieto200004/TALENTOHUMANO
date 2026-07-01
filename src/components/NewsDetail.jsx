import { useEffect, useState } from 'react'
import { CATEGORIA_COLOR } from '../data/defaultNews'
import HtmlPostViewer from './HtmlPostViewer'
import ShareButton from './ShareButton'
import './NewsDetail.css'

export default function NewsDetail({ noticia, onClose }) {
  const [htmlContent, setHtmlContent] = useState(noticia.cuerpo || '')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  useEffect(() => {
    if (noticia.isHtml && !noticia.cuerpo && noticia.url) {
      fetch(noticia.url)
        .then((res) => res.text())
        .then((text) => setHtmlContent(text))
        .catch((err) => {
          console.error('Error fetching HTML content:', err)
          setHtmlContent('<p style="color: red; text-align: center; padding: 20px;">Error al cargar el contenido de la noticia.</p>')
        })
    } else {
      setHtmlContent(noticia.cuerpo || '')
    }
  }, [noticia])

  const fecha = new Date(noticia.fechaPublicacion).toLocaleDateString('es-CO', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const color = CATEGORIA_COLOR[noticia.categoria] || '#000F26'
  const isPattern = noticia.imagen?.startsWith('pattern:')

  const formatCuerpo = (text) => {
    if (!text) return ''
    // Si ya parece HTML (empieza con etiqueta), devolver tal cual para legibilidad de noticias antiguas
    if (text.trim().startsWith('<')) return text
    
    // Dividir por doble salto de línea para crear párrafos
    // y convertir saltos simples en <br/> para mantener la intención del usuario
    return text
      .split(/\n\n+/)
      .map(para => `<p>${para.replace(/\n/g, '<br/>')}</p>`)
      .join('')
  }

  return (
    <div className="news-detail-overlay" onClick={onClose}>
      <div className="news-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="news-detail-floating-actions">
          <ShareButton noticia={noticia} />
          <button className="news-detail-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="news-detail-scroll">
          {!noticia.isHtml && (
            <div className="news-detail-header">
              {noticia.imagen && (
                isPattern ? (
                  <div className={`news-detail-hero news-${noticia.imagen.replace(':', '-')}`} />
                ) : (
                  <img src={noticia.imagen} alt="" className="news-detail-hero" />
                )
              )}
              <div className="news-detail-meta-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div>
                  <span className="news-detail-cat" style={{ backgroundColor: color }}>
                    {noticia.categoria}
                  </span>
                  <span className="news-detail-date">{fecha}</span>
                </div>
              </div>
            </div>
          )}

          {noticia.isHtml ? (
            <div className="news-detail-html-only">
              <HtmlPostViewer html={htmlContent} />
            </div>
          ) : (
            <div className="news-detail-body">
              <h1 className="news-detail-title">{noticia.titulo}</h1>
              
              <p className="news-detail-resumen">
                {noticia.resumen}
              </p>

              <div 
                className="news-detail-content"
                dangerouslySetInnerHTML={{ __html: formatCuerpo(noticia.cuerpo) }}
              />

            {noticia.redireccionUrl && (
              <div className="news-detail-actions">
                <a 
                  href={noticia.redireccionUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-more-info"
                  style={{ backgroundColor: color }}
                >
                  Click aquí para más información
                </a>
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  )
}

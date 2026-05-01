import { useEffect } from 'react'
import { CATEGORIA_COLOR } from '../data/defaultNews'
import './NewsDetail.css'

export default function NewsDetail({ noticia, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  const fecha = new Date(noticia.fechaPublicacion).toLocaleDateString('es-CO', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const color = CATEGORIA_COLOR[noticia.categoria] || '#000F26'
  const isPattern = noticia.imagen?.startsWith('pattern:')

  return (
    <div className="news-detail-overlay" onClick={onClose}>
      <div className="news-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="news-detail-close" onClick={onClose}>✕</button>
        
        <div className="news-detail-scroll">
          <div className="news-detail-header">
            {noticia.imagen && (
              isPattern ? (
                <div className={`news-detail-hero news-${noticia.imagen.replace(':', '-')}`} />
              ) : (
                <img src={noticia.imagen} alt="" className="news-detail-hero" />
              )
            )}
            <div className="news-detail-meta-top">
              <span className="news-detail-cat" style={{ backgroundColor: color }}>
                {noticia.categoria}
              </span>
              <span className="news-detail-date">{fecha}</span>
            </div>
          </div>

          <div className="news-detail-body">
            <h1 className="news-detail-title">{noticia.titulo}</h1>
            
            <p className="news-detail-resumen">
              {noticia.resumen}
            </p>

            <div 
              className="news-detail-content"
              dangerouslySetInnerHTML={{ __html: noticia.cuerpo }}
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
        </div>
      </div>
    </div>
  )
}

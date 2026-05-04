import { CATEGORIA_COLOR } from '../data/defaultNews'
import './NewsCard.css'

export default function NewsCard({ noticia, onEdit, onDelete, onClick, isEditor, index }) {
  const color = CATEGORIA_COLOR[noticia.categoria] || '#000F26'
  const fecha = new Date(noticia.fechaPublicacion).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  // 0 is Hero, 5 is Banner (6th item)
  const isHero = index === 0
  const isBanner = index === 5

  return (
    <article 
      className={`news-card ${isHero ? 'news-card--hero' : ''} ${isBanner ? 'news-card--banner' : ''} ${!noticia.publicada ? 'news-card--draft' : ''}`}
      onClick={() => onClick(noticia)}
    >
      <div className="news-card-visual">
        <div className="news-card-image-wrap">
          {noticia.imagen && (
            noticia.imagen.startsWith('pattern:') ? (
              <div className={`news-card-img news-${noticia.imagen.replace(':', '-')}`} />
            ) : (
              <img src={noticia.imagen} alt="" className="news-card-img" />
            )
          )}
          <div className="news-card-overlay">
            <span className="btn-read-more">Leer más</span>
          </div>
        </div>
        <div className="news-card-accent" style={{ background: color }} />
      </div>
      
      <div className="news-card-body">
        <div className="news-card-meta">
          <span className="news-cat" style={{ color }}>
            {noticia.categoria}
          </span>
          <span className="news-fecha">{fecha}</span>
          {!noticia.publicada && <span className="news-draft-badge">Borrador</span>}
        </div>
        <h3 className="news-card-title">{noticia.titulo}</h3>
        <p className="news-card-resumen">{noticia.resumen}</p>

        {isEditor && (
          <div className="news-card-actions" onClick={e => e.stopPropagation()}>
            <button className="btn-edit" onClick={() => onEdit(noticia)}>
              Editar
            </button>
            <button className="btn-delete" onClick={() => onDelete(noticia.id)}>
              Eliminar
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

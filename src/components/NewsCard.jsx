import { CATEGORIA_COLOR } from '../data/defaultNews'
import './NewsCard.css'

export default function NewsCard({ noticia, onEdit, onDelete, isEditor }) {
  const color = CATEGORIA_COLOR[noticia.categoria] || '#000F26'
  const fecha = new Date(noticia.fechaPublicacion).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <article className={`news-card ${!noticia.publicada ? 'news-card--draft' : ''}`}>
      {noticia.imagen && (
        <img src={noticia.imagen} alt="" className="news-card-img" />
      )}
      <div className="news-card-accent" style={{ background: color }} />
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
          <div className="news-card-actions">
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

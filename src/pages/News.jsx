import { useState } from 'react'
import { useNewsContext } from '../context/NewsContext'
import { useAuth } from '../context/AuthContext'
import { CATEGORIAS, CATEGORIA_COLOR } from '../data/defaultNews'
import NewsCard from '../components/NewsCard'
import NewsEditor from '../components/NewsEditor'
import AdminPanel from '../components/AdminPanel'
import NewsDetail from '../components/NewsDetail'
import './News.css'

export default function News() {
  const { news, addNews, updateNews, deleteNews } = useNewsContext()
  const { isEditor } = useAuth()
  const [catFiltro, setCatFiltro] = useState('Todas')
  const [editando, setEditando] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [selectedNews, setSelectedNews] = useState(null)

  const visibles = news
    .filter((n) => isEditor || n.publicada)
    .filter((n) => catFiltro === 'Todas' || n.categoria === catFiltro)
    .sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion))

  function handleEdit(noticia) {
    setEditando(noticia)
    setEditorOpen(true)
  }

  function handleNew() {
    setEditando(null)
    setEditorOpen(true)
  }

  function handleSave(data) {
    if (editando) {
      updateNews(data)
    } else {
      addNews(data)
    }
    setEditorOpen(false)
  }

  function handleDelete(id) {
    if (confirm('¿Eliminar esta noticia?')) deleteNews(id)
  }

  return (
    <main className="news-page">
      <div className="container">
        <header className="news-header">
          <h1 className="news-title">Noticias y <br/><span className="text-blue">Comunicados</span></h1>
          {isEditor && (
            <div className="news-editor-top">
              <button className="btn-add-news" onClick={handleNew}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Nueva Noticia
              </button>
            </div>
          )}
        </header>

        {/* Filtros */}
        <div className="filtros">
          <button
            className={`filtro-btn ${catFiltro === 'Todas' ? 'active' : ''}`}
            onClick={() => setCatFiltro('Todas')}
          >
            Todas
          </button>
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              className={`filtro-btn ${catFiltro === c ? 'active' : ''}`}
              onClick={() => setCatFiltro(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Lista tipo Galería */}
        {visibles.length === 0 ? (
          <p className="empty-msg">No hay noticias en esta categoría.</p>
        ) : (
          <div className="news-gallery-grid">
            {visibles.map((n, index) => (
              <NewsCard
                key={n.id}
                noticia={n}
                index={index}
                isEditor={isEditor}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onClick={(noticia) => setSelectedNews(noticia)}
              />
            ))}
          </div>
        )}
      </div>

      {editorOpen && (
        <NewsEditor
          noticia={editando}
          onSave={handleSave}
          onClose={() => setEditorOpen(false)}
        />
      )}

      {selectedNews && (
        <NewsDetail
          noticia={selectedNews}
          onClose={() => setSelectedNews(null)}
        />
      )}
    </main>
  )
}

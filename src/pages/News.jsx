import { useState } from 'react'
import { useNewsContext } from '../context/NewsContext'
import { useAuth } from '../context/AuthContext'
import { CATEGORIAS, CATEGORIA_COLOR } from '../data/defaultNews'
import NewsCard from '../components/NewsCard'
import NewsEditor from '../components/NewsEditor'
import AdminPanel from '../components/AdminPanel'
import './News.css'

export default function News() {
  const { news, addNews, updateNews, deleteNews } = useNewsContext()
  const { isEditor } = useAuth()
  const [catFiltro, setCatFiltro] = useState('Todas')
  const [editando, setEditando] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)

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
    <main>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Noticias</h1>
          <p className="page-desc">Todas las novedades del área de Talento Humano</p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          {isEditor && <AdminPanel onNewClick={handleNew} />}

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
                style={catFiltro === c ? { borderColor: CATEGORIA_COLOR[c], color: CATEGORIA_COLOR[c] } : {}}
                onClick={() => setCatFiltro(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Lista */}
          {visibles.length === 0 ? (
            <p className="empty-msg">No hay noticias en esta categoría.</p>
          ) : (
            <div className="news-list-full">
              {visibles.map((n) => (
                <NewsCard
                  key={n.id}
                  noticia={n}
                  isEditor={isEditor}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {editorOpen && (
        <NewsEditor
          noticia={editando}
          onSave={handleSave}
          onClose={() => setEditorOpen(false)}
        />
      )}
    </main>
  )
}

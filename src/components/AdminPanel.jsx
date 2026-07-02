import { useRef, useState } from 'react'
import { exportNews, importNews } from '../hooks/useNews'
import { useNewsContext } from '../context/NewsContext'
import ConfirmModal from './ConfirmModal'
import './AdminPanel.css'

export default function AdminPanel({ onNewClick }) {
  const { news, importNews: importCtx } = useNewsContext()
  const fileRef = useRef()
  const [importConfirmOpen, setImportConfirmOpen] = useState(false)
  const [pendingFile, setPendingFile] = useState(null)

  function handleExport() {
    exportNews(news)
  }

  async function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    setPendingFile(file)
    setImportConfirmOpen(true)
    e.target.value = ''
  }

  async function executeImport() {
    if (!pendingFile) return
    try {
      const data = await importNews(pendingFile)
      importCtx(data)
      alert(`${data.length} noticias importadas correctamente.`)
    } catch (err) {
      alert(`Error al importar: ${err.message}`)
    }
    setImportConfirmOpen(false)
    setPendingFile(null)
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-left">
        <span className="admin-panel-label">Panel editor</span>
        <span className="admin-panel-count">{news.length} noticias en total</span>
      </div>
      <div className="admin-panel-actions">
        <button className="admin-btn admin-btn-ghost" onClick={handleExport}>
          Exportar JSON
        </button>
        <button className="admin-btn admin-btn-ghost" onClick={() => fileRef.current.click()}>
          Importar JSON
        </button>
        <input type="file" accept=".json" ref={fileRef} onChange={handleImport} style={{ display: 'none' }} />
        <button className="admin-btn admin-btn-primary" onClick={onNewClick}>
          + Nueva noticia
        </button>
      </div>

      <ConfirmModal
        isOpen={importConfirmOpen}
        title="¿Importar datos?"
        message="Estás a punto de importar noticias. Esto sobrescribirá o agregará datos a los existentes. ¿Estás seguro de que deseas continuar?"
        onConfirm={executeImport}
        onCancel={() => { setImportConfirmOpen(false); setPendingFile(null); }}
      />
    </div>
  )
}

import { createContext, useContext, useReducer, useEffect, useState } from 'react'

const NewsContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'SET':
      return action.news
    case 'ADD':
      return [action.news, ...state]
    case 'UPDATE':
      return state.map((n) => (n.id === action.news.id ? action.news : n))
    case 'DELETE':
      return state.filter((n) => n.id !== action.id)
    default:
      return state
  }
}

export function NewsProvider({ children }) {
  const [news, dispatch] = useReducer(reducer, [])
  const [confirmDialog, setConfirmDialog] = useState(null)
  const [loadingProgress, setLoadingProgress] = useState(null)

  // Load news from index.json on mount
  useEffect(() => {
    fetch('/noticias/index.json')
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: 'SET', news: data })
      })
      .catch((err) => console.error('Error loading news:', err))
  }, [])

  const startLoadingTimer = () => {
    setLoadingProgress({ progress: 0, secondsLeft: 210, done: false })
    
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (!prev) {
          clearInterval(interval)
          return null
        }
        if (prev.secondsLeft <= 1) {
          clearInterval(interval)
          return { progress: 100, secondsLeft: 0, done: true }
        }
        const nextSeconds = prev.secondsLeft - 1
        const nextProgress = ((210 - nextSeconds) / 210) * 100
        return { progress: nextProgress, secondsLeft: nextSeconds, done: false }
      })
    }, 1000)
  }

  const showErrorDialog = (message) => {
    setConfirmDialog({
      title: '⚠️ Error en la operación',
      message: message,
      confirmText: 'Aceptar',
      cancelText: null,
      onConfirm: () => setConfirmDialog(null)
    })
  }

  const saveNewsApi = async (noticia) => {
    try {
      const response = await fetch('/api/publicar-noticia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noticia),
      })
      const data = await response.json()
      if (data.ok) {
        return data
      } else {
        showErrorDialog(`No se pudo guardar la noticia: ${data.error || 'Error interno'}`)
        return null
      }
    } catch (err) {
      console.error('Error saving news via API:', err)
      showErrorDialog('Error de conexión con el servidor. Por favor verifica tu conexión.')
      return null
    }
  }

  const addNews = async (noticia) => {
    const tempId = `temp-${Date.now()}`
    const newNoticia = { ...noticia, id: tempId }
    dispatch({ type: 'ADD', news: newNoticia })
    
    const result = await saveNewsApi(noticia)
    if (result && result.ok) {
      const finalNoticia = { ...noticia, id: result.id, url: result.url }
      dispatch({ type: 'UPDATE', news: finalNoticia })
      startLoadingTimer()
    }
  }

  const updateNews = async (noticia) => {
    dispatch({ type: 'UPDATE', news: noticia })
    const result = await saveNewsApi(noticia)
    if (result && result.ok) {
      startLoadingTimer()
    }
  }

  const deleteNews = async (id) => {
    const noticia = news.find(n => n.id === id)
    if (noticia) {
      setConfirmDialog({
        title: '¿Eliminar noticia?',
        message: `¿Estás seguro de que deseas eliminar la noticia "${noticia.titulo}"? Esta acción la despublicará permanentemente de la intranet.`,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
        onConfirm: async () => {
          setConfirmDialog(null)
          const despublicada = { ...noticia, publicada: false }
          dispatch({ type: 'UPDATE', news: despublicada })
          const result = await saveNewsApi(despublicada)
          if (result && result.ok) {
            startLoadingTimer()
          }
        },
        onCancel: () => setConfirmDialog(null)
      })
    }
  }

  const importNews = async (data) => {
    dispatch({ type: 'SET', news: data })
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')} min`
  }

  return (
    <NewsContext.Provider value={{ news, addNews, updateNews, deleteNews, importNews }}>
      {children}

      {/* Estilos dinámicos para los modales */}
      <style>{`
        .custom-dialog-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 15, 38, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          font-family: 'Inter', sans-serif;
        }
        .custom-dialog-box {
          background: #000F26;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 35px 30px;
          border-radius: 24px;
          width: 90%;
          max-width: 480px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          text-align: center;
          color: #ffffff;
          animation: modalScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .custom-loading-box {
          background: #000F26;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 40px 35px;
          border-radius: 28px;
          width: 90%;
          max-width: 550px;
          box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.6);
          text-align: center;
          color: #ffffff;
          animation: modalScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes modalScale {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .custom-dialog-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 12px;
        }
        .custom-dialog-message {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 28px;
          line-height: 1.6;
        }
        .custom-dialog-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .btn-dialog-confirm {
          background: #DC2626;
          color: #ffffff;
          border: none;
          padding: 12px 28px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
        }
        .btn-dialog-confirm:hover {
          background: #B91C1C;
          transform: translateY(-1px);
        }
        .btn-dialog-cancel {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 28px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-dialog-cancel:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-1px);
        }
        .loading-progress-bar-container {
          width: 100%;
          height: 10px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          overflow: hidden;
          margin: 28px 0 14px 0;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .loading-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #FBC02D, #FFD54F);
          width: 0%;
          border-radius: 6px;
          box-shadow: 0 0 10px rgba(251, 192, 45, 0.5);
        }
        .loading-countdown {
          font-size: 2.2rem;
          font-weight: 900;
          color: #FBC02D;
          margin: 15px 0;
          letter-spacing: -0.02em;
        }
        .btn-loading-done {
          background: #10B981;
          color: #ffffff;
          border: none;
          padding: 14px 32px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
          margin-top: 15px;
          animation: pulseGreen 2s infinite;
        }
        .btn-loading-done:hover {
          background: #059669;
          transform: translateY(-1px);
        }
        @keyframes pulseGreen {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>

      {/* Modal de Confirmación Personalizado */}
      {confirmDialog && (
        <div className="custom-dialog-overlay">
          <div className="custom-dialog-box">
            <h3 className="custom-dialog-title">{confirmDialog.title}</h3>
            <p className="custom-dialog-message">{confirmDialog.message}</p>
            <div className="custom-dialog-actions">
              {confirmDialog.cancelText && (
                <button className="btn-dialog-cancel" onClick={confirmDialog.onCancel}>
                  {confirmDialog.cancelText}
                </button>
              )}
              <button 
                className="btn-dialog-confirm" 
                onClick={confirmDialog.onConfirm}
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Progreso de Carga de 3.5 Minutos */}
      {loadingProgress && (
        <div className="custom-dialog-overlay">
          <div className="custom-loading-box">
            <h3 className="custom-dialog-title" style={{ color: loadingProgress.done ? '#10B981' : '#ffffff' }}>
              {loadingProgress.done ? '¡Cambios Aplicados con Éxito!' : 'Aplicando cambios en el servidor...'}
            </h3>
            <p className="custom-dialog-message" style={{ marginBottom: loadingProgress.done ? '10px' : '20px' }}>
              {loadingProgress.done 
                ? 'El portal ha sido recompilado en Azure. Presiona el botón de abajo para refrescar el sitio y ver los cambios.'
                : 'Estamos publicando tu contenido en GitHub y recompilando el portal en Azure Static Web Apps. Este proceso toma exactamente 3.5 minutos.'}
            </p>
            
            {!loadingProgress.done && (
              <>
                <div className="loading-countdown">
                  {formatTime(loadingProgress.secondsLeft)}
                </div>
                <div className="loading-progress-bar-container">
                  <div 
                    className="loading-progress-bar" 
                    style={{ width: `${loadingProgress.progress}%` }}
                  />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Por favor, no cierres ni recargues esta pestaña
                </span>
              </>
            )}

            {loadingProgress.done && (
              <button className="btn-loading-done" onClick={() => window.location.reload()}>
                Recargar Intranet
              </button>
            )}
          </div>
        </div>
      )}
    </NewsContext.Provider>
  )
}

export function useNewsContext() {
  const context = useContext(NewsContext)
  if (!context) {
    throw new Error('useNewsContext must be used within a NewsProvider')
  }
  return context
}

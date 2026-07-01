import { createContext, useContext, useReducer, useEffect } from 'react'

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

  // Load news from index.json on mount
  useEffect(() => {
    fetch('/noticias/index.json')
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: 'SET', news: data })
      })
      .catch((err) => console.error('Error loading news:', err))
  }, [])

  const saveNewsApi = async (noticia) => {
    try {
      const response = await fetch('/api/publicar-noticia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noticia),
      })
      const data = await response.json()
      if (data.ok) {
        alert('✅ Noticia guardada correctamente. Estará visible públicamente en 2-3 minutos.')
        return data
      } else {
        alert(`⚠️ Error: ${data.error || 'No se pudo guardar la noticia'}`)
      }
    } catch (err) {
      console.error('Error saving news via API:', err)
      alert('⚠️ Error de conexión al guardar la noticia.')
    }
  }

  const addNews = async (noticia) => {
    const tempId = `temp-${Date.now()}`
    const newNoticia = { ...noticia, id: tempId }
    dispatch({ type: 'ADD', news: newNoticia })
    
    const result = await saveNewsApi(noticia)
    if (result && result.ok) {
      // Reemplazar la noticia temporal con los datos reales devueltos (incluyendo el ID real y URL)
      const finalNoticia = { ...noticia, id: result.id, url: result.url }
      dispatch({ type: 'UPDATE', news: finalNoticia })
    }
  }

  const updateNews = async (noticia) => {
    dispatch({ type: 'UPDATE', news: noticia })
    await saveNewsApi(noticia)
  }

  const deleteNews = async (id) => {
    // Para simplificar la Opción A sin endpoints adicionales de borrado en GitHub,
    // podemos despublicar la noticia en el cliente
    const noticia = news.find(n => n.id === id)
    if (noticia) {
      const despublicada = { ...noticia, publicada: false }
      dispatch({ type: 'UPDATE', news: despublicada })
      await saveNewsApi(despublicada)
    }
  }

  const importNews = async (data) => {
    dispatch({ type: 'SET', news: data })
    // Importación por lotes no soportada por el endpoint individual de la Function
  }

  return (
    <NewsContext.Provider value={{ news, addNews, updateNews, deleteNews, importNews }}>
      {children}
    </NewsContext.Provider>
  )
}

export function useNewsContext() {
  return useContext(NewsContext)
}

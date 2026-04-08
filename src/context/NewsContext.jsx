import { createContext, useContext, useReducer, useEffect } from 'react'
import { loadNews, saveNews } from '../hooks/useNews'

const NewsContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [action.news, ...state]
    case 'UPDATE':
      return state.map((n) => (n.id === action.news.id ? action.news : n))
    case 'DELETE':
      return state.filter((n) => n.id !== action.id)
    case 'IMPORT':
      return action.news
    default:
      return state
  }
}

export function NewsProvider({ children }) {
  const [news, dispatch] = useReducer(reducer, null, loadNews)

  useEffect(() => {
    saveNews(news)
  }, [news])

  function addNews(noticia) {
    dispatch({ type: 'ADD', news: { ...noticia, id: crypto.randomUUID() } })
  }

  function updateNews(noticia) {
    dispatch({ type: 'UPDATE', news: noticia })
  }

  function deleteNews(id) {
    dispatch({ type: 'DELETE', id })
  }

  function importNews(data) {
    dispatch({ type: 'IMPORT', news: data })
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

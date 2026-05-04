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

  // Load news from API on mount
  useEffect(() => {
    fetch('/api/news')
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: 'SET', news: data })
      })
      .catch((err) => console.error('Error loading news:', err))
  }, [])

  // Helper to save entire news list to API
  const persist = async (updatedNews) => {
    try {
      await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNews),
      })
    } catch (err) {
      console.error('Error saving news:', err)
    }
  }

  const addNews = async (noticia) => {
    const newNoticia = { ...noticia, id: crypto.randomUUID() }
    const newState = [newNoticia, ...news]
    dispatch({ type: 'ADD', news: newNoticia })
    await persist(newState)
  }

  const updateNews = async (noticia) => {
    const newState = news.map((n) => (n.id === noticia.id ? noticia : n))
    dispatch({ type: 'UPDATE', news: noticia })
    await persist(newState)
  }

  const deleteNews = async (id) => {
    const newState = news.filter((n) => n.id !== id)
    dispatch({ type: 'DELETE', id })
    await persist(newState)
  }

  const importNews = async (data) => {
    dispatch({ type: 'SET', news: data })
    await persist(data)
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

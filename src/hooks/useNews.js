import { defaultNews } from '../data/defaultNews'

const STORAGE_KEY = 'th_noticias'

export function loadNews() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return defaultNews
}

export function saveNews(news) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(news))
}

export function exportNews(news) {
  const blob = new Blob([JSON.stringify(news, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'noticias.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function importNews(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (Array.isArray(data)) resolve(data)
        else reject(new Error('Formato inválido'))
      } catch {
        reject(new Error('No se pudo leer el archivo'))
      }
    }
    reader.readAsText(file)
  })
}

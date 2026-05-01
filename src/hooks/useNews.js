// Obsoleto: La persistencia ahora se maneja vía API en NewsContext.jsx
// Se mantiene este archivo solo para funciones de exportación/importación de archivos locales si se requiere.

export function exportNews(news) {
  const blob = new Blob([JSON.stringify(news, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `noticias_talentohumano_${new Date().toISOString().slice(0, 10)}.json`
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

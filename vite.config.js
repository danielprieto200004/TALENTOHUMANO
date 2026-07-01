import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Custom plugin for persistence
function persistencePlugin() {
  return {
    name: 'persistence-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // GET /api/news
        if (req.url === '/api/news' && req.method === 'GET') {
          const filePath = path.resolve(__dirname, 'src/data/news.json')
          if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end(data)
          } else {
            // Fallback to defaultNews if news.json doesn't exist yet
            res.end(JSON.stringify([]))
          }
          return
        }

        // POST /api/news
        if (req.url === '/api/news' && req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => (body += chunk))
          req.on('end', () => {
            const filePath = path.resolve(__dirname, 'src/data/news.json')
            fs.writeFileSync(filePath, body, 'utf-8')
            res.end(JSON.stringify({ success: true }))
          })
          return
        }

        // POST /api/publicar-noticia (Mock para desarrollo local)
        if (req.url === '/api/publicar-noticia' && req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => (body += chunk))
          req.on('end', () => {
            const data = JSON.parse(body)
            const timestamp = Date.now()
            const isEditing = !!data.id
            const targetId = data.id || `noticia-${timestamp}-${Math.random().toString(36).substr(2, 9)}`
            
            const indexFilePath = path.resolve(__dirname, 'public/noticias/index.json')
            let listaActual = []
            if (fs.existsSync(indexFilePath)) {
              listaActual = JSON.parse(fs.readFileSync(indexFilePath, 'utf-8'))
            }

            let urlEstatica = ''
            if (data.isHtml) {
              const slug = data.titulo.toLowerCase()
                                 .normalize('NFD')
                                 .replace(/[\u0300-\u036f]/g, '')
                                 .replace(/[^a-z0-9]+/g, '-')
                                 .slice(0, 50)
              
              let nombreArchivo = ''
              const noticiaExistente = listaActual.find(n => n.id === targetId)
              if (noticiaExistente && noticiaExistente.url && noticiaExistente.url.startsWith('/noticias/')) {
                nombreArchivo = noticiaExistente.url.replace('/noticias/', '')
              } else {
                nombreArchivo = `noticia-${timestamp}-${slug}.html`
              }

              const htmlFilePath = path.resolve(__dirname, 'public/noticias', nombreArchivo)
              fs.writeFileSync(htmlFilePath, data.cuerpo || '', 'utf-8')
              urlEstatica = `/noticias/${nombreArchivo}`
            }

            const noticiaData = {
              id: targetId,
              titulo: data.titulo,
              resumen: data.resumen || '',
              categoria: data.categoria || 'General',
              imagen: data.imagen || 'pattern:1',
              fechaPublicacion: data.fechaPublicacion || new Date().toISOString(),
              publicada: data.publicada !== undefined ? data.publicada : true,
              redireccionUrl: data.redireccionUrl || '',
              isHtml: !!data.isHtml,
              cuerpo: data.isHtml ? '' : data.cuerpo,
              url: urlEstatica
            }

            const indexExistente = listaActual.findIndex(n => n.id === targetId)
            if (indexExistente !== -1) {
              listaActual[indexExistente] = noticiaData
            } else {
              listaActual.unshift(noticiaData)
            }

            fs.writeFileSync(indexFilePath, JSON.stringify(listaActual, null, 2), 'utf-8')
            
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              ok: true,
              mensaje: 'Noticia guardada localmente.',
              id: targetId,
              url: urlEstatica
            }))
          })
          return
        }

        // POST /api/upload-image
        if (req.url === '/api/upload-image' && req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => (body += chunk))
          req.on('end', () => {
            const { name, data } = JSON.parse(body)
            const base64Data = data.replace(/^data:image\/\w+;base64,/, '')
            const buffer = Buffer.from(base64Data, 'base64')
            const fileName = `${Date.now()}-${name}`
            const filePath = path.resolve(__dirname, 'src/assets/news', fileName)
            
            // Ensure directory exists
            const dir = path.dirname(filePath)
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
            
            fs.writeFileSync(filePath, buffer)
            res.end(JSON.stringify({ url: `/src/assets/news/${fileName}` }))
          })
          return
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), persistencePlugin()],
})

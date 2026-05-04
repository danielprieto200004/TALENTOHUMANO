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

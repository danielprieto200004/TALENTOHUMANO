import { useState, useEffect, useRef, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { CATEGORIAS } from '../data/defaultNews'
import ConfirmModal from './ConfirmModal'
import './NewsEditor.css'

// Image cropping utilities
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.src = url
  })

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  // Set width to target max width for consistency
  const targetWidth = 1200
  const scale = targetWidth / pixelCrop.width
  canvas.width = targetWidth
  canvas.height = pixelCrop.height * scale

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0, 0, canvas.width, canvas.height
  )

  return canvas.toDataURL('image/jpeg', 0.85)
}

// Get local YYYY-MM-DD
function getLocalDate() {
  const d = new Date()
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - (offset * 60 * 1000))
  return local.toISOString().split('T')[0]
}

const empty = {
  titulo: '',
  resumen: '',
  cuerpo: '',
  categoria: 'General',
  imagen: 'pattern:1',
  fechaPublicacion: getLocalDate(),
  publicada: true,
  redireccionUrl: '',
  isHtml: false,
}

const PATTERNS = ['pattern:1', 'pattern:2', 'pattern:3']

export default function NewsEditor({ noticia, onSave, onClose }) {
  const [form, setForm] = useState(empty)
  const [loadingImg, setLoadingImg] = useState(false)
  const [htmlFileName, setHtmlFileName] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [imgSrc, setImgSrc] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const imgInputRef = useRef()

  useEffect(() => {
    if (noticia) {
      setForm({
        ...empty, // Use defaults for any missing fields
        ...noticia,
        fechaPublicacion: noticia.fechaPublicacion ? noticia.fechaPublicacion.slice(0, 10) : getLocalDate(),
      })
    } else {
      setForm(empty)
    }
  }, [noticia])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.addEventListener('load', () => setImgSrc(reader.result))
    reader.readAsDataURL(file)
  }

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  async function uploadCroppedImage() {
    setLoadingImg(true)
    try {
      const base64 = await getCroppedImg(imgSrc, croppedAreaPixels)
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'cropped_cover.jpg', data: base64 })
      })
      const { url } = await res.json()
      
      setForm((prev) => {
        const next = { ...prev, imagen: url }
        // Si es HTML, reemplazar la imagen antigua por la nueva recortada en el código
        if (prev.isHtml && prev.cuerpo && imgSrc) {
          next.cuerpo = prev.cuerpo.replace(imgSrc, url)
        }
        return next
      })
      
      setImgSrc(null)
    } catch (err) {
      console.error('Error uploading image:', err)
      alert('Error al subir la imagen recortada')
    } finally {
      setLoadingImg(false)
    }
  }

  function handleHtmlUpload(e) {
    const file = e.target.files[0]
    if (!file) {
      setHtmlFileName('')
      return
    }
    setHtmlFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      const htmlText = event.target.result
      setForm((prev) => {
        const updated = { ...prev, cuerpo: htmlText, isHtml: true }

        try {
          const parser = new DOMParser()
          const doc = parser.parseFromString(htmlText, 'text/html')

          // 1. Título
          let title = ''
          const titleTag = doc.querySelector('title')
          if (titleTag && titleTag.textContent && titleTag.textContent !== 'Plantilla Blog Symbiotic') {
            title = titleTag.textContent.trim()
          }
          if (!title) {
            const heroTitle = doc.querySelector('.hero-title')
            if (heroTitle && heroTitle.textContent) {
              title = heroTitle.textContent.replace(/\s+/g, ' ').trim()
            }
          }
          if (title) updated.titulo = title

          // 2. Categoría
          let category = ''
          const metaCat = doc.querySelector('meta[name="category"]')
          if (metaCat && metaCat.getAttribute('content')) {
            category = metaCat.getAttribute('content').trim()
          } else {
            const badge = doc.querySelector('.badge')
            if (badge) {
              category = badge.textContent.replace(/•/g, '').trim()
            }
          }
          if (category) {
            // Verificar si es categoría válida o aproximada
            const matches = CATEGORIAS.find(c => c.toLowerCase() === category.toLowerCase())
            if (matches) {
              updated.categoria = matches
            } else {
              updated.categoria = 'General'
            }
          }

          // 3. Resumen
          let excerpt = ''
          const metaDesc = doc.querySelector('meta[name="description"]') || doc.querySelector('meta[name="excerpt"]')
          if (metaDesc && metaDesc.getAttribute('content')) {
            excerpt = metaDesc.getAttribute('content').trim()
          } else {
            const heroExcerpt = doc.querySelector('.hero-excerpt')
            if (heroExcerpt && heroExcerpt.textContent) {
              excerpt = heroExcerpt.textContent.replace(/\s+/g, ' ').trim()
            }
          }
          if (excerpt) updated.resumen = excerpt

          // 4. Imagen de Portada
          let portada = ''
          const firstImg = doc.querySelector('img')
          if (firstImg && firstImg.src && !firstImg.src.startsWith('data:image/svg+xml')) {
            portada = firstImg.getAttribute('src')
          }
          if (portada) updated.imagen = portada

        } catch (err) {
          console.error('Error parsing HTML for autofill:', err)
        }
        return updated
      })
    }
    reader.readAsText(file)
  }

  function selectPattern(pattern) {
    setForm((prev) => ({ ...prev, imagen: pattern }))
    if (imgInputRef.current) imgInputRef.current.value = ''
  }

  function handleSaveClick(e) {
    e.preventDefault()
    if (!form.titulo || !form.resumen) {
      alert("Por favor, completa el título y resumen antes de continuar.")
      return
    }
    setConfirmOpen(true)
  }

  function executeSave() {
    const [y, m, d] = form.fechaPublicacion.split('-')
    const finalDate = new Date(y, m - 1, d, 12, 0, 0).toISOString()

    onSave({
      ...form,
      fechaPublicacion: finalDate,
    })
    setConfirmOpen(false)
  }

  const isPattern = form.imagen?.startsWith('pattern:')

  return (
    <div className="editor-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="editor-modal">
        <div className="editor-header">
          <h2>{noticia ? 'Editar noticia' : 'Nueva noticia'}</h2>
          <button className="editor-close" onClick={onClose}>✕</button>
        </div>

        <form className="editor-form" onSubmit={(e) => e.preventDefault()}>
          <div className="field">
            <label>Tipo de Contenido</label>
            <div style={{ display: 'flex', gap: '20px', marginTop: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="isHtml"
                  value="false"
                  checked={!form.isHtml}
                  onChange={() => setForm((prev) => ({ ...prev, isHtml: false }))}
                />
                Ingreso Manual (Texto)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="isHtml"
                  value="true"
                  checked={form.isHtml}
                  onChange={() => setForm((prev) => ({ ...prev, isHtml: true }))}
                />
                Cargar Archivo HTML
              </label>
            </div>
          </div>

          {form.isHtml ? (
            <div className="field html-upload-section">
              <label className="html-upload-title">Cargar HTML del Artículo</label>
              
              <label className="html-upload-dropzone">
                <div className="html-upload-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <span className="html-upload-text">
                  {htmlFileName ? htmlFileName : 'Haz clic o arrastra para seleccionar archivo'}
                </span>
                <span className="html-upload-hint">Solo archivos .html permitidos</span>
                <input
                  type="file"
                  accept=".html"
                  onChange={handleHtmlUpload}
                  style={{ display: 'none' }}
                />
              </label>

              <div className="html-templates-container">
                <span className="html-templates-title">O descarga una plantilla base premium:</span>
                <div className="html-templates-buttons">
                  <a href="/templates/template-1-editorial.html" download="plantilla-editorial.html" className="template-btn template-btn-editorial">
                    <span className="template-icon">📝</span> Editorial
                  </a>
                  <a href="/templates/template-2-moderno.html" download="plantilla-moderna.html" className="template-btn template-btn-moderna">
                    <span className="template-icon">✨</span> Moderna
                  </a>
                  <a href="/templates/template-3-boletin.html" download="plantilla-boletin.html" className="template-btn template-btn-boletin">
                    <span className="template-icon">📬</span> Boletín
                  </a>
                </div>
              </div>
              <p className="field-hint" style={{ marginTop: '16px' }}>
                Al subir la plantilla, los metadatos como el título, resumen y categoría se autocompletarán mágicamente.
              </p>
            </div>
          ) : null}

          <div className="field">
            <label>Título</label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
              placeholder="Título de la noticia"
            />
          </div>

          <div className="field">
            <label>Resumen</label>
            <textarea
              name="resumen"
              value={form.resumen}
              onChange={handleChange}
              required
              rows={2}
              placeholder="Texto corto que aparece en la tarjeta"
            />
          </div>

          {!form.isHtml && (
            <>
              <div className="field">
                <label>Contenido completo (Cuerpo)</label>
                <textarea
                  name="cuerpo"
                  value={form.cuerpo}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Escribe el contenido de la noticia"
                />
                <p className="field-hint">
                  Usa doble salto de línea para crear párrafos.
                </p>
              </div>

              <div className="field">
                <label>URL para redireccionar (Opcional)</label>
                <input
                  name="redireccionUrl"
                  value={form.redireccionUrl}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/mas-info"
                />
              </div>
            </>
          )}

          <div className="field-row">
            <div className="field">
              <label>Categoría</label>
              <select name="categoria" value={form.categoria} onChange={handleChange}>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Fecha de publicación</label>
              <input
                type="date"
                name="fechaPublicacion"
                value={form.fechaPublicacion}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <label>Imagen de Portada o Estilo Visual</label>
            <p className="field-hint" style={{ marginTop: '-4px', marginBottom: '8px' }}>
              {form.isHtml ? 'Si tu HTML no tiene una imagen, puedes subir una manualmente para la portada.' : ''}
            </p>
            <div className="image-management">
                {imgSrc ? (
                  <div style={{ position: 'relative', height: '320px', width: '100%', background: '#333', borderRadius: '12px', overflow: 'hidden' }}>
                    <Cropper
                      image={imgSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={16 / 9}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={handleCropComplete}
                    />
                    <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', gap: '12px', zIndex: 10 }}>
                      <button type="button" onClick={() => setImgSrc(null)} style={{ padding: '8px 16px', borderRadius: '8px', background: '#fff', color: '#333', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                        Cancelar
                      </button>
                      <button type="button" onClick={uploadCroppedImage} disabled={loadingImg} style={{ padding: '8px 16px', borderRadius: '8px', background: '#0ea5e9', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                        {loadingImg ? 'Recortando...' : 'Confirmar Recorte'}
                      </button>
                    </div>
                  </div>
                ) : !isPattern && form.imagen ? (
                  <div className="img-preview">
                    <img src={form.imagen} alt="preview" />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button type="button" className="img-remove" style={{ background: '#0ea5e9' }} onClick={() => setImgSrc(form.imagen)}>
                        Recortar / Editar Imagen
                      </button>
                      <button type="button" className="img-remove" onClick={() => selectPattern('pattern:1')}>
                        Quitar imagen y usar estilo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pattern-setup">
                    <label className="img-upload-btn">
                      {loadingImg ? 'Subiendo...' : 'Subir imagen desde PC'}
                      <input
                        ref={imgInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>

                    <div className="field-hint" style={{ margin: '12px 0 6px' }}>O elige un estilo abstracto:</div>
                    <div className="pattern-selector">
                      {PATTERNS.map((p) => (
                        <div
                          key={p}
                          className={`pattern-option news-${p.replace(':', '-')} ${form.imagen === p ? 'pattern-option--selected' : ''}`}
                          onClick={() => selectPattern(p)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          <label className="field-check">
            <input
              type="checkbox"
              name="publicada"
              checked={form.publicada}
              onChange={handleChange}
            />
            Publicada (visible para colaboradores)
          </label>

          <div className="editor-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn-save" disabled={loadingImg} onClick={handleSaveClick}>
              {noticia ? 'Guardar cambios' : 'Publicar noticia'}
            </button>
          </div>
        </form>
      </div>

      {confirmOpen && console.log("ConfirmModal should be open now!")}
      <ConfirmModal
        isOpen={confirmOpen}
        title="¿Aplicar cambios?"
        message="Estás a punto de guardar estos cambios en la noticia. ¿Deseas continuar?"
        onConfirm={executeSave}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}

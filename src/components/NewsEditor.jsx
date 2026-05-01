import { useState, useEffect, useRef } from 'react'
import { CATEGORIAS } from '../data/defaultNews'
import './NewsEditor.css'

function resizeImage(file, maxWidth = 1200) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.src = url
  })
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
}

const PATTERNS = ['pattern:1', 'pattern:2', 'pattern:3']

export default function NewsEditor({ noticia, onSave, onClose }) {
  const [form, setForm] = useState(empty)
  const [loadingImg, setLoadingImg] = useState(false)
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

  async function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setLoadingImg(true)
    
    try {
      const base64 = await resizeImage(file)
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: file.name, data: base64 })
      })
      const { url } = await res.json()
      setForm((prev) => ({ ...prev, imagen: url }))
    } catch (err) {
      console.error('Error uploading image:', err)
      alert('Error al subir la imagen')
    } finally {
      setLoadingImg(false)
    }
  }

  function selectPattern(pattern) {
    setForm((prev) => ({ ...prev, imagen: pattern }))
    if (imgInputRef.current) imgInputRef.current.value = ''
  }

  function handleSubmit(e) {
    e.preventDefault()
    // To avoid timezone shifting to previous day, we treat the date as local noon
    const [y, m, d] = form.fechaPublicacion.split('-')
    const finalDate = new Date(y, m - 1, d, 12, 0, 0).toISOString()
    
    onSave({
      ...form,
      fechaPublicacion: finalDate,
    })
  }

  const isPattern = form.imagen?.startsWith('pattern:')

  return (
    <div className="editor-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="editor-modal">
        <div className="editor-header">
          <h2>{noticia ? 'Editar noticia' : 'Nueva noticia'}</h2>
          <button className="editor-close" onClick={onClose}>✕</button>
        </div>

        <form className="editor-form" onSubmit={handleSubmit}>
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

          <div className="field">
            <label>Contenido completo (Cuerpo)</label>
            <textarea
              name="cuerpo"
              value={form.cuerpo}
              onChange={handleChange}
              rows={6}
              placeholder="Puedes usar HTML básico: <p>, <ul>, <li>, <strong>"
            />
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
            <label>Imagen o Estilo Visual</label>
            <div className="image-management">
              {!isPattern && form.imagen ? (
                <div className="img-preview">
                  <img src={form.imagen} alt="preview" />
                  <button type="button" className="img-remove" onClick={() => selectPattern('pattern:1')}>
                    Quitar imagen y usar estilo
                  </button>
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
            <button type="submit" className="btn-save" disabled={loadingImg}>
              {noticia ? 'Guardar cambios' : 'Publicar noticia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

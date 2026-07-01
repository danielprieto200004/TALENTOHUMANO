import { useEffect, useRef, useState } from 'react'

/**
 * Renders an HTML blog post inside a sandboxed iframe.
 * Auto-adjusts height via postMessage from the template script
 * and also polls scrollHeight as a fallback.
 */
export default function HtmlPostViewer({ html, className = '' }) {
  const iframeRef = useRef(null)
  const [iframeHeight, setIframeHeight] = useState(600)

  const adjustHeight = () => {
    const iframe = iframeRef.current
    if (!iframe) return
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (doc && doc.documentElement) {
        const h = doc.documentElement.scrollHeight
        if (h && h > 100) setIframeHeight(h)
      }
    } catch (_) {
      // Cross-origin fallback — height comes from postMessage
    }
  }

  useEffect(() => {
    // Listen for height messages sent by the template script
    const onMessage = (e) => {
      if (e.data?.type === 'symbiotic-iframe-height' && typeof e.data.height === 'number') {
        if (e.data.height > 100) setIframeHeight(e.data.height)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <div style={{ width: '100%', ...className }}>
      <iframe
        ref={iframeRef}
        srcDoc={html}
        sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
        style={{
          width: '100%',
          border: 'none',
          display: 'block',
          height: `${iframeHeight}px`,
          minHeight: '400px',
        }}
        onLoad={() => {
          adjustHeight()
          // Poll for a few seconds to catch lazy-loaded content
          ;[200, 500, 1000, 2000, 3500].forEach((ms) => setTimeout(adjustHeight, ms))
        }}
        title="Contenido del artículo"
      />
    </div>
  )
}

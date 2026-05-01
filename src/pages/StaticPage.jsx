import './StaticPage.css'

const tipoIcon = {
  PDF: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  DOCX: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
}

export default function StaticPage({ data, accentColor }) {
  return (
    <main className="news-page">
      <div className="container">
        <header className="news-header">
          <h1 className="news-title">{data.titulo}</h1>
          <p className="news-desc">{data.descripcion}</p>
        </header>
      </div>

      <div className="section">
        <div className="container static-layout">
          {data.bloques.map((bloque, i) => (
            <div key={bloque.id} className="static-bloque">
              <div className="static-bloque-num">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="static-bloque-body">
                <h2 className="static-bloque-title">{bloque.titulo}</h2>
                <p className="static-bloque-content">{bloque.contenido}</p>

                {bloque.documentos?.length > 0 && (
                  <ul className="doc-list">
                    {bloque.documentos.map((doc) => (
                      <li key={doc.nombre} className="doc-item">
                        <span className="doc-icon" style={{ color: accentColor }}>
                          {tipoIcon[doc.tipo] || tipoIcon.PDF}
                        </span>
                        <span className="doc-nombre">{doc.nombre}</span>
                        <span className="doc-tipo">{doc.tipo}</span>
                        <button className="doc-link">Solicitar →</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

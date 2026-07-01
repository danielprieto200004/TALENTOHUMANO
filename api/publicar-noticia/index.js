const https = require('https');

module.exports = async function (context, req) {
  try {
    // 1. Leer variables de entorno de Azure
    const GITHUB_TOKEN  = process.env.GITHUB_TOKEN;
    const GITHUB_OWNER  = process.env.GITHUB_OWNER;
    const GITHUB_REPO   = process.env.GITHUB_REPO;
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

    // 2. Leer el cuerpo de la petición
    const { 
      id, 
      titulo, 
      cuerpo, // Este es htmlContenido o cuerpo de texto plano
      resumen, 
      categoria, 
      imagen, 
      fechaPublicacion, 
      publicada, 
      redireccionUrl, 
      isHtml 
    } = req.body;

    if (!titulo) {
      context.res = {
        status: 400,
        body: { error: 'El título es requerido' }
      };
      return;
    }

    const timestamp = Date.now();
    const isEditing = !!id;
    const targetId = id || `noticia-${timestamp}-${Math.random().toString(36).substr(2, 9)}`;

    // 3. Obtener el index.json actual de GitHub para saber si existe y actualizarlo
    let listaActual = [];
    let shaIndex = null;
    try {
      const resIndex = await obtenerArchivoGitHub(GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, 'public/noticias/index.json');
      shaIndex = resIndex.sha;
      listaActual = JSON.parse(Buffer.from(resIndex.content, 'base64').toString('utf-8'));
    } catch (e) {
      // Si no existe, empezará como array vacío
    }

    // 4. Determinar si se creará o actualizará un archivo HTML estático
    let nombreArchivo = '';
    let rutaArchivo = '';
    let urlEstatica = '';
    let shaHTML = null;

    if (isHtml) {
      const slug = titulo.toLowerCase()
                         .normalize('NFD')
                         .replace(/[\u0300-\u036f]/g, '')
                         .replace(/[^a-z0-9]+/g, '-')
                         .slice(0, 50);

      // Buscar si ya existía la noticia en el índice
      const noticiaExistente = listaActual.find(n => n.id === targetId);
      if (noticiaExistente && noticiaExistente.url && noticiaExistente.url.startsWith('/noticias/')) {
        nombreArchivo = noticiaExistente.url.replace('/noticias/', '');
      } else {
        nombreArchivo = `noticia-${timestamp}-${slug}.html`;
      }

      rutaArchivo = `public/noticias/${nombreArchivo}`;
      urlEstatica = `/noticias/${nombreArchivo}`;

      // Obtener el SHA del HTML si ya existe
      try {
        const resHTML = await obtenerArchivoGitHub(GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, rutaArchivo);
        shaHTML = resHTML.sha;
      } catch (e) {
        // Archivo nuevo
      }

      // Subir el archivo HTML a GitHub
      const contenidoBase64 = Buffer.from(cuerpo || '', 'utf-8').toString('base64');
      const payloadHTML = {
        message: `📰 Guardar HTML de noticia: ${titulo}`,
        content: contenidoBase64,
        branch: GITHUB_BRANCH,
        ...(shaHTML && { sha: shaHTML })
      };

      await githubPUT(GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, rutaArchivo, payloadHTML);
    }

    // 5. Actualizar el índice JSON
    const noticiaData = {
      id: targetId,
      titulo,
      resumen: resumen || '',
      categoria: categoria || 'General',
      imagen: imagen || 'pattern:1',
      fechaPublicacion: fechaPublicacion || new Date().toISOString(),
      publicada: publicada !== undefined ? publicada : true,
      redireccionUrl: redireccionUrl || '',
      isHtml: !!isHtml,
      cuerpo: isHtml ? '' : cuerpo, // Si es HTML, no guardamos el cuerpo completo en el index
      url: urlEstatica
    };

    const indexExistente = listaActual.findIndex(n => n.id === targetId);
    if (indexExistente !== -1) {
      // Editar
      listaActual[indexExistente] = noticiaData;
    } else {
      // Nueva
      listaActual.unshift(noticiaData);
    }

    // Subir el index.json actualizado
    const indexBase64 = Buffer.from(JSON.stringify(listaActual, null, 2), 'utf-8').toString('base64');
    const payloadIndex = {
      message: isEditing ? `📋 Actualizar noticia en el índice: ${titulo}` : `📋 Registrar nueva noticia en el índice: ${titulo}`,
      content: indexBase64,
      branch: GITHUB_BRANCH,
      ...(shaIndex && { sha: shaIndex })
    };

    await githubPUT(GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, 'public/noticias/index.json', payloadIndex);

    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        ok: true,
        mensaje: 'Noticia guardada correctamente. Estará visible en 2-3 minutos.',
        id: targetId,
        url: urlEstatica
      }
    };
  } catch (error) {
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: { 
        ok: false, 
        error: `Error en la API de CMS: ${error.message}` 
      }
    };
  }
};

// ─────────────────────────────────────────────────────────────
// FUNCIONES AUXILIARES DE GITHUB
// ─────────────────────────────────────────────────────────────
function obtenerArchivoGitHub(token, owner, repo, branch, path) {
  return new Promise((resolve, reject) => {
    const opciones = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'azure-cms-noticias',
        'Accept': 'application/vnd.github+json'
      }
    };

    const req = https.request(opciones, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`GitHub API error: status ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function githubPUT(token, owner, repo, path, payload) {
  return new Promise((resolve, reject) => {
    const cuerpo = JSON.stringify(payload);
    const opciones = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}/contents/${path}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'azure-cms-noticias',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(cuerpo)
      }
    };

    const req = https.request(opciones, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`GitHub PUT error: status ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(cuerpo);
    req.end();
  });
}

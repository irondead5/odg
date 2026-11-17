import { defineCommand } from 'citty';
import pc from 'picocolors';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

export const uiCommand = defineCommand({
  meta: {
    name: 'ui',
    description: 'Launch the ODG Documentation WebApp & Viewer on localhost'
  },
  args: {
    port: {
      type: 'string',
      description: 'Port to listen on (default: 4321)',
      default: '4321'
    }
  },
  async run({ args }) {
    const port = parseInt(args.port || '4321', 10);
    const rootDir = process.cwd();
    const odgDir = path.join(rootDir, '.odg');

    const server = http.createServer(async (req, res) => {
      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      const url = new URL(req.url || '/', `http://${req.headers.host}`);

      // API: Manifest
      if (url.pathname === '/api/manifest') {
        try {
          const content = await fs.readFile(path.join(odgDir, 'radar-manifest.json'), 'utf-8');
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(content);
        } catch {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ summary: { coverage: { total: 0 } }, modules: {} }));
        }
        return;
      }

      // API: Blueprint
      if (url.pathname === '/api/blueprint') {
        try {
          const content = await fs.readFile(path.join(odgDir, 'blueprint.json'), 'utf-8');
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(content);
        } catch {
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'blueprint.json not found' }));
        }
        return;
      }

      // API: List Documents
      if (url.pathname === '/api/docs') {
        try {
          const humanDir = path.join(odgDir, 'human');
          const docs = await collectDocs(humanDir);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify(docs));
        } catch {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify([]));
        }
        return;
      }

      // API: Get Single Document
      if (url.pathname.startsWith('/api/doc/')) {
        const docSubPath = decodeURIComponent(url.pathname.replace('/api/doc/', ''));
        const docFilePath = path.join(odgDir, 'human', docSubPath);
        try {
          const content = await fs.readFile(docFilePath, 'utf-8');
          res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(content);
        } catch {
          res.writeHead(404);
          res.end('Document not found');
        }
        return;
      }

      // Default: Serve standalone SPA HTML with Mermaid.js & Markdown Viewer
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(generateSpaHtml());
    });

    server.listen(port, () => {
      console.log(pc.bold('\n🌐 Open Docs Gen (`odg ui`) — Localhost Portal'));
      console.log(`   ${pc.green(`http://localhost:${port}`)}`);
      console.log(pc.dim('   Presiona Ctrl+C para detener el servidor.\n'));
    });
  }
});

async function collectDocs(dir: string, baseDir: string = dir): Promise<Array<{ path: string; name: string; category: string }>> {
  const result: Array<{ path: string; name: string; category: string }> = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const sub = await collectDocs(fullPath, baseDir);
        result.push(...sub);
      } else if (entry.name.endsWith('.md')) {
        const relative = path.relative(baseDir, fullPath);
        const parts = relative.split(path.sep);
        const category = parts.length > 1 ? parts[0] : 'general';
        result.push({
          path: relative,
          name: entry.name.replace(/\.md$/, ''),
          category
        });
      }
    }
  } catch {
    // ignore missing dir
  }
  return result;
}

function generateSpaHtml(): string {
  return `<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Open Docs Gen — Architecture Portal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: '#3b82f6'
          }
        }
      }
    }
  </script>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    window.mermaid = mermaid;
    mermaid.initialize({ startOnLoad: false, theme: 'dark' });
  </script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown-dark.min.css">
  <style>
    .markdown-body {
      background-color: transparent !important;
      color: #e2e8f0;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    .markdown-body pre {
      background-color: #0f172a !important;
      border: 1px solid #1e293b;
    }
    .mermaid-box {
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin: 1.5rem 0;
      display: flex;
      justify-content: center;
      overflow-x: auto;
    }
    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #0b0f19; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
  </style>
</head>
<body class="bg-[#0b0f19] text-slate-200 min-h-screen flex flex-col font-sans">
  <!-- Topbar -->
  <header class="h-14 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur sticky top-0 z-50 flex items-center justify-between px-6">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-blue-500/20">
        odg
      </div>
      <h1 class="font-semibold text-sm tracking-wide text-white">Open Docs Gen <span class="text-xs font-normal text-slate-400">Architecture Portal</span></h1>
    </div>
    <div class="flex items-center gap-4">
      <div id="coverage-badge" class="px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-medium flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
        <span id="coverage-text">Cargando cobertura...</span>
      </div>
      <button onclick="toggleTheme()" class="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700">
        🌓 Tema
      </button>
    </div>
  </header>

  <!-- Layout -->
  <div class="flex flex-1 overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-72 border-r border-slate-800 bg-[#0c1222] p-4 flex flex-col gap-6 overflow-y-auto">
      <div>
        <h2 class="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2">Resumen General</h2>
        <div id="summary-info" class="space-y-1 text-xs text-slate-400">
          Cargando datos...
        </div>
      </div>

      <div>
        <h2 class="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2">Documentos & Módulos</h2>
        <ul id="docs-list" class="space-y-1 text-xs">
          <li class="text-slate-500">Buscando documentos...</li>
        </ul>
      </div>

      <div class="mt-auto pt-4 border-t border-slate-800 text-[11px] text-slate-500">
        Localhost viewer &bull; 100% Client-side Mermaid
      </div>
    </aside>

    <!-- Content Canvas -->
    <main class="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto">
      <div id="loading" class="text-center py-20 text-slate-500 text-sm">
        Cargando especificación...
      </div>
      <article id="doc-content" class="markdown-body hidden"></article>
    </main>
  </div>

  <script>
    let activeDoc = null;

    async function init() {
      await loadManifest();
      await loadDocsList();
    }

    async function loadManifest() {
      try {
        const res = await fetch('/api/manifest');
        const data = await res.json();
        const cov = data.summary?.coverage?.total ?? data.coverage?.totalPct ?? 0;
        document.getElementById('coverage-text').innerText = 'Coverage: ' + cov + '%';

        const modulesCount = data.summary?.totalModules ?? data.modules?.length ?? 0;
        const documentedCount = data.summary?.documentedModules ?? 0;

        document.getElementById('summary-info').innerHTML = \`
          <div class="flex justify-between py-1 border-b border-slate-800">
            <span>Módulos Totales:</span>
            <span class="font-medium text-slate-200">\${modulesCount}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-800">
            <span>Documentados:</span>
            <span class="font-medium text-green-400">\${documentedCount}</span>
          </div>
        \`;
      } catch (e) {
        console.error(e);
      }
    }

    async function loadDocsList() {
      try {
        const res = await fetch('/api/docs');
        const docs = await res.json();
        const listEl = document.getElementById('docs-list');

        if (!docs.length) {
          listEl.innerHTML = '<li class="text-amber-400/80">No hay documentos en .odg/human todavía.</li>';
          document.getElementById('loading').innerHTML = '⚠️ No se encontraron documentos en <code>.odg/human/</code>.<br>Ejecuta <code>odg craft &lt;module&gt;</code> para generar alguno.';
          return;
        }

        listEl.innerHTML = '';
        docs.forEach((d, idx) => {
          const li = document.createElement('li');
          const btn = document.createElement('button');
          btn.className = 'w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/80 hover:text-white transition flex items-center justify-between';
          btn.innerHTML = \`<span>📄 \${d.name}</span><span class="text-[10px] text-slate-500 uppercase">\${d.category}</span>\`;
          btn.onclick = () => selectDoc(d.path, btn);
          li.appendChild(btn);
          listEl.appendChild(li);

          if (idx === 0) {
            selectDoc(d.path, btn);
          }
        });
      } catch (e) {
        console.error(e);
      }
    }

    async function selectDoc(docPath, btnEl) {
      document.querySelectorAll('#docs-list button').forEach(b => {
        b.classList.remove('bg-blue-600/20', 'text-blue-300', 'font-medium', 'border', 'border-blue-500/30');
      });
      if (btnEl) {
        btnEl.classList.add('bg-blue-600/20', 'text-blue-300', 'font-medium', 'border', 'border-blue-500/30');
      }

      const loadingEl = document.getElementById('loading');
      const contentEl = document.getElementById('doc-content');
      loadingEl.classList.remove('hidden');
      contentEl.classList.add('hidden');

      try {
        const res = await fetch('/api/doc/' + encodeURIComponent(docPath));
        const rawMarkdown = await res.text();

        // Custom renderer for Mermaid
        const renderer = new marked.Renderer();
        const defaultCode = renderer.code.bind(renderer);

        renderer.code = function({ text, lang }) {
          if (lang === 'mermaid') {
            return '<div class="mermaid-box"><pre class="mermaid">' + text + '</pre></div>';
          }
          return defaultCode({ text, lang });
        };

        marked.setOptions({ renderer });
        contentEl.innerHTML = marked.parse(rawMarkdown);

        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');

        // Render Mermaid Diagrams
        if (window.mermaid) {
          await window.mermaid.run({
            nodes: contentEl.querySelectorAll('pre.mermaid')
          });
        }
      } catch (e) {
        loadingEl.innerText = 'Error al cargar el documento: ' + e.message;
      }
    }

    function toggleTheme() {
      document.documentElement.classList.toggle('dark');
    }

    window.onload = init;
  </script>
</body>
</html>
`;
}

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
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      const url = new URL(req.url || '/', `http://${req.headers.host}`);

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

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(generateSpaHtml());
    });

    server.listen(port, () => {
      console.log(pc.bold('\n🌐 Open Docs Gen (`odg ui`) — Pro Portal'));
      console.log(`   ${pc.cyan(`http://localhost:${port}`)}`);
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
    // ignore
  }
  return result;
}

function generateSpaHtml(): string {
  return `<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Open Docs Gen — Architecture Portal Pro</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace']
          },
          colors: {
            brand: {
              50: '#eff6ff',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              900: '#1e3a8a',
              950: '#0f172a'
            }
          }
        }
      }
    }
  </script>
  <!-- Marked parser with SVG pan zoom & Lucide icons -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js"></script>
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    window.mermaid = mermaid;
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        fontSize: '16px',
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        darkMode: true,
        background: '#0d1322',
        mainBkg: '#151d30',
        nodeBorder: '#38bdf8',
        lineColor: '#60a5fa'
      }
    });
  </script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown-dark.min.css">
  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .markdown-body {
      background-color: transparent !important;
      color: #cbd5e1 !important;
      font-size: 1.05rem !important;
      line-height: 1.75 !important;
    }
    .markdown-body h1 {
      font-size: 2.35rem !important;
      font-weight: 800 !important;
      letter-spacing: -0.03em !important;
      color: #f8fafc !important;
      border-bottom: 1px solid #1e293b !important;
      padding-bottom: 0.8rem !important;
      margin-bottom: 1.8rem !important;
    }
    .markdown-body h2 {
      font-size: 1.65rem !important;
      font-weight: 700 !important;
      letter-spacing: -0.02em !important;
      color: #f1f5f9 !important;
      border-bottom: 1px solid #1e293b !important;
      padding-bottom: 0.5rem !important;
      margin-top: 2.5rem !important;
      margin-bottom: 1.2rem !important;
    }
    .markdown-body h3 {
      font-size: 1.35rem !important;
      font-weight: 600 !important;
      color: #e2e8f0 !important;
      margin-top: 1.8rem !important;
      margin-bottom: 0.8rem !important;
    }
    .markdown-body p, .markdown-body li {
      font-size: 1.05rem !important;
      color: #cbd5e1 !important;
    }
    .markdown-body pre {
      background-color: #0d1322 !important;
      border: 1px solid #1e293b !important;
      border-radius: 0.75rem !important;
      padding: 1rem 1.25rem !important;
      font-size: 0.95rem !important;
    }
    .markdown-body table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin: 1.5rem 0 !important;
      font-size: 0.95rem !important;
    }
    .markdown-body th {
      background: #111827 !important;
      color: #94a3b8 !important;
      padding: 0.75rem 1rem !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
      font-size: 0.8rem !important;
      letter-spacing: 0.05em !important;
    }
    .markdown-body td {
      padding: 0.75rem 1rem !important;
      border-color: #1e293b !important;
    }

    /* Modern Diagram Cards */
    .mermaid-wrapper {
      position: relative;
      background: radial-gradient(circle at top left, #131b2e 0%, #090e1a 100%);
      border: 1px solid #1e293b;
      border-radius: 1rem;
      margin: 2rem 0;
      overflow: hidden;
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .mermaid-wrapper:hover {
      border-color: #3b82f6;
      box-shadow: 0 15px 35px -10px rgba(59, 130, 246, 0.15);
    }
    .mermaid-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.25rem;
      background: #0f172a;
      border-bottom: 1px solid #1e293b;
    }
    .mermaid-viewport {
      width: 100%;
      height: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      user-select: none;
    }
    .mermaid-viewport:active {
      cursor: grabbing;
    }
    .mermaid-viewport svg {
      width: 100% !important;
      height: 100% !important;
      max-width: none !important;
    }

    /* Modal Fullscreen */
    #zoom-modal.active {
      display: flex !important;
    }

    /* Scrollbars */
    ::-webkit-scrollbar { width: 7px; height: 7px; }
    ::-webkit-scrollbar-track { background: #080c16; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #334155; }
  </style>
</head>
<body class="bg-[#080c16] text-slate-200 min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white">

  <!-- Topbar -->
  <header class="h-16 border-b border-slate-800/80 bg-[#0c1222]/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-500/25">
        odg
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="font-bold text-sm tracking-tight text-white">Open Docs Gen</h1>
          <span class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Pro Studio</span>
        </div>
        <p class="text-[11px] text-slate-400 font-medium">Architecture Intelligence & Living Documentation</p>
      </div>
    </div>

    <!-- Center Navigation Search / Hint -->
    <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
      <span class="text-blue-400">💡 Tip:</span> Haz clic y arrastra sobre cualquier diagrama para hacer Pan & Zoom
    </div>

    <!-- Right Controls -->
    <div class="flex items-center gap-3">
      <div id="coverage-badge" class="px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-700/50 text-blue-300 text-xs font-semibold flex items-center gap-2 shadow-sm">
        <span class="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"></span>
        <span id="coverage-text">Calculando...</span>
      </div>
      <button onclick="toggleTheme()" class="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/80 transition flex items-center gap-1.5">
        <span>🌓</span> Tema
      </button>
    </div>
  </header>

  <!-- Main App Layout -->
  <div class="flex flex-1 overflow-hidden">
    
    <!-- Left Navigation Sidebar -->
    <aside class="w-80 border-r border-slate-800/80 bg-[#0a0f1d] p-5 flex flex-col gap-6 overflow-y-auto">
      
      <!-- Metrics Card -->
      <div class="p-4 rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs uppercase font-bold text-slate-400 tracking-wider">Estado del Sistema</span>
          <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">Online</span>
        </div>
        <div id="summary-info" class="space-y-2 text-xs">
          Cargando métricas...
        </div>
      </div>

      <!-- Module & Document Navigation -->
      <div class="flex-1">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-xs uppercase font-bold text-slate-400 tracking-wider">Módulos & Documentos</h2>
          <span id="doc-count" class="text-[11px] font-mono text-slate-500">0 docs</span>
        </div>
        <ul id="docs-list" class="space-y-1.5 text-sm font-medium">
          <li class="text-slate-500 text-xs py-2">Explorando .odg/human...</li>
        </ul>
      </div>

      <!-- Quick Command Footer -->
      <div class="pt-4 border-t border-slate-800/80 text-xs text-slate-500 flex flex-col gap-1.5 font-mono">
        <div class="flex items-center gap-1.5 text-slate-400">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <span>CLI: /odg-craft &lt;module&gt;</span>
        </div>
        <div class="text-[11px] text-slate-500">Zero-thought spec engine</div>
      </div>
    </aside>

    <!-- Center Canvas -->
    <main class="flex-1 overflow-y-auto px-10 py-10 bg-[#080c16]">
      <div class="max-w-4xl mx-auto">
        <div id="loading" class="text-center py-28 text-slate-400 text-base font-medium">
          <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          Cargando arquitectura y diagramas interactivos...
        </div>
        <article id="doc-content" class="markdown-body hidden"></article>
      </div>
    </main>
  </div>

  <!-- Fullscreen Diagram Zoom Modal -->
  <div id="zoom-modal" class="fixed inset-0 z-50 bg-[#050811]/95 backdrop-blur-xl hidden flex-col p-6">
    <div class="flex items-center justify-between pb-4 border-b border-slate-800">
      <div class="flex items-center gap-3">
        <span class="w-3 h-3 rounded-full bg-blue-500"></span>
        <h3 id="modal-title" class="font-bold text-base text-white tracking-wide">Visor de Diagrama en Alta Definición</h3>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="modalZoomIn()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition">
          🔍+ Acercar
        </button>
        <button onclick="modalZoomOut()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition">
          🔍- Alejar
        </button>
        <button onclick="modalResetZoom()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition">
          ↺ Reset
        </button>
        <button onclick="closeModal()" class="px-4 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-500 text-white text-xs font-semibold transition ml-2">
          ✕ Cerrar
        </button>
      </div>
    </div>
    <div id="modal-body" class="flex-1 w-full h-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing p-4">
      <!-- Cloned SVG goes here -->
    </div>
  </div>

  <script>
    let panZoomInstances = [];
    let modalPanZoom = null;

    async function init() {
      await loadManifest();
      await loadDocsList();
    }

    async function loadManifest() {
      try {
        const res = await fetch('/api/manifest');
        const data = await res.json();
        const cov = data.summary?.coverage?.total ?? data.coverage?.totalPct ?? 0;
        document.getElementById('coverage-text').innerText = cov + '% Cobertura';

        const modulesCount = data.summary?.totalModules ?? data.modules?.length ?? 0;
        const documentedCount = data.summary?.documentedModules ?? 0;
        const pendingCount = Math.max(0, modulesCount - documentedCount);

        document.getElementById('summary-info').innerHTML = \`
          <div class="flex justify-between items-center py-1 border-b border-slate-800/80 text-slate-300">
            <span>Módulos Totales:</span>
            <span class="font-bold text-white text-sm">\${modulesCount}</span>
          </div>
          <div class="flex justify-between items-center py-1 border-b border-slate-800/80 text-slate-300">
            <span>Documentados:</span>
            <span class="font-bold text-emerald-400 text-sm">\${documentedCount}</span>
          </div>
          <div class="flex justify-between items-center py-1 text-slate-300">
            <span>Pendientes:</span>
            <span class="font-bold text-amber-400 text-sm">\${pendingCount}</span>
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
        document.getElementById('doc-count').innerText = docs.length + ' docs';

        if (!docs.length) {
          listEl.innerHTML = '<li class="text-amber-400/80 text-xs py-2">No hay documentos generados.</li>';
          document.getElementById('loading').innerHTML = '⚠️ No hay documentos en <code>.odg/human/</code>.<br>Ejecuta <code>odg craft &lt;module&gt;</code> para documentar.';
          return;
        }

        listEl.innerHTML = '';
        docs.forEach((d, idx) => {
          const li = document.createElement('li');
          const btn = document.createElement('button');
          btn.className = 'w-full text-left px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/80 hover:text-white transition flex items-center justify-between text-xs tracking-tight';
          btn.innerHTML = \`
            <span class="flex items-center gap-2 truncate">
              <span class="text-blue-400">📄</span>
              <span class="truncate font-semibold">\${d.name}</span>
            </span>
            <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 uppercase">\${d.category}</span>
          \`;
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
        b.classList.remove('bg-blue-600/20', 'text-blue-300', 'font-bold', 'border', 'border-blue-500/40', 'shadow-sm');
      });
      if (btnEl) {
        btnEl.classList.add('bg-blue-600/20', 'text-blue-300', 'font-bold', 'border', 'border-blue-500/40', 'shadow-sm');
      }

      const loadingEl = document.getElementById('loading');
      const contentEl = document.getElementById('doc-content');
      loadingEl.classList.remove('hidden');
      contentEl.classList.add('hidden');

      // Cleanup old pan-zooms
      panZoomInstances.forEach(pz => {
        try { pz.destroy(); } catch (_) {}
      });
      panZoomInstances = [];

      try {
        const res = await fetch('/api/doc/' + encodeURIComponent(docPath));
        const rawMarkdown = await res.text();

        let diagramCounter = 0;
        const renderer = new marked.Renderer();
        const defaultCode = renderer.code.bind(renderer);

        renderer.code = function({ text, lang }) {
          if (lang === 'mermaid') {
            diagramCounter++;
            const diagId = 'mermaid-diag-' + diagramCounter;
            return \`
              <div class="mermaid-wrapper" id="wrap-\${diagId}">
                <div class="mermaid-header">
                  <span class="text-xs font-semibold text-slate-300 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-cyan-400"></span> Diagrama Interactivo \${diagramCounter}
                  </span>
                  <div class="flex items-center gap-1.5">
                    <button onclick="zoomInDiagram('\${diagId}')" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700" title="Acercar">🔍+</button>
                    <button onclick="zoomOutDiagram('\${diagId}')" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700" title="Alejar">🔍-</button>
                    <button onclick="resetDiagram('\${diagId}')" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700" title="Centrar">↺</button>
                    <button onclick="openModalDiagram('\${diagId}')" class="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold ml-1 flex items-center gap-1" title="Pantalla Completa">
                      ⛶ Expandir
                    </button>
                  </div>
                </div>
                <div class="mermaid-viewport" id="viewport-\${diagId}">
                  <pre class="mermaid" id="\${diagId}">\${text}</pre>
                </div>
              </div>
            \`;
          }
          return defaultCode({ text, lang });
        };

        marked.setOptions({ renderer });
        contentEl.innerHTML = marked.parse(rawMarkdown);

        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');

        // Render Mermaid Diagrams & Bind svg-pan-zoom
        if (window.mermaid) {
          await window.mermaid.run({
            nodes: contentEl.querySelectorAll('pre.mermaid')
          });

          // Initialize Interactive SVG Pan-Zoom on each rendered diagram
          const wrappers = contentEl.querySelectorAll('.mermaid-wrapper');
          wrappers.forEach((wrapper) => {
            const svg = wrapper.querySelector('svg');
            if (svg) {
              svg.style.width = '100%';
              svg.style.height = '100%';
              const pz = svgPanZoom(svg, {
                zoomEnabled: true,
                controlIconsEnabled: false,
                fit: true,
                center: true,
                minZoom: 0.3,
                maxZoom: 10,
                zoomScaleSensitivity: 0.25
              });
              wrapper._panZoom = pz;
              panZoomInstances.push(pz);
            }
          });
        }
      } catch (e) {
        loadingEl.innerText = 'Error al cargar el documento: ' + e.message;
      }
    }

    function zoomInDiagram(id) {
      const wrap = document.getElementById('wrap-' + id);
      if (wrap && wrap._panZoom) wrap._panZoom.zoomIn();
    }

    function zoomOutDiagram(id) {
      const wrap = document.getElementById('wrap-' + id);
      if (wrap && wrap._panZoom) wrap._panZoom.zoomOut();
    }

    function resetDiagram(id) {
      const wrap = document.getElementById('wrap-' + id);
      if (wrap && wrap._panZoom) {
        wrap._panZoom.resetZoom();
        wrap._panZoom.center();
      }
    }

    function openModalDiagram(id) {
      const wrap = document.getElementById('wrap-' + id);
      const svg = wrap ? wrap.querySelector('svg') : null;
      if (!svg) return;

      const modal = document.getElementById('zoom-modal');
      const body = document.getElementById('modal-body');
      body.innerHTML = '';

      const cloneSvg = svg.cloneNode(true);
      cloneSvg.id = 'modal-svg';
      cloneSvg.style.width = '100%';
      cloneSvg.style.height = '100%';
      body.appendChild(cloneSvg);

      modal.classList.add('active');

      if (modalPanZoom) {
        try { modalPanZoom.destroy(); } catch (_) {}
      }

      modalPanZoom = svgPanZoom(cloneSvg, {
        zoomEnabled: true,
        controlIconsEnabled: false,
        fit: true,
        center: true,
        minZoom: 0.2,
        maxZoom: 15,
        zoomScaleSensitivity: 0.25
      });
    }

    function modalZoomIn() {
      if (modalPanZoom) modalPanZoom.zoomIn();
    }

    function modalZoomOut() {
      if (modalPanZoom) modalPanZoom.zoomOut();
    }

    function modalResetZoom() {
      if (modalPanZoom) {
        modalPanZoom.resetZoom();
        modalPanZoom.center();
      }
    }

    function closeModal() {
      const modal = document.getElementById('zoom-modal');
      modal.classList.remove('active');
      if (modalPanZoom) {
        try { modalPanZoom.destroy(); } catch (_) {}
        modalPanZoom = null;
      }
    }

    function toggleTheme() {
      document.documentElement.classList.toggle('dark');
    }

    // Escape key closes modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    window.onload = init;
  </script>
</body>
</html>
`;
}

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
          }
        }
      }
    }
  </script>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js"></script>
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    window.mermaid = mermaid;
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        fontSize: '15px',
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        darkMode: true,
        background: '#0d1322',
        mainBkg: '#162035',
        primaryColor: '#1e293b',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#38bdf8',
        lineColor: '#60a5fa',
        secondaryColor: '#1e293b',
        tertiaryColor: '#0f172a',
        textColor: '#f1f5f9',
        actorBkg: '#1e293b',
        actorBorder: '#60a5fa',
        actorTextColor: '#ffffff',
        actorLineColor: '#93c5fd',
        signalColor: '#60a5fa',
        signalTextColor: '#e2e8f0',
        labelBoxBkgColor: '#1e293b',
        labelBoxBorderColor: '#38bdf8',
        labelTextColor: '#f8fafc',
        loopTextColor: '#e2e8f0',
        noteBorderColor: '#38bdf8',
        noteBkgColor: '#1e293b',
        noteTextColor: '#f8fafc'
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

    /* Modern Diagram Cards: Clean clickable card that launches Fullscreen */
    .mermaid-card {
      position: relative;
      background: #0d1322;
      border: 1px solid #1e293b;
      border-radius: 1rem;
      margin: 2.2rem 0;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.6);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .mermaid-card:hover {
      border-color: #38bdf8;
      box-shadow: 0 15px 35px -5px rgba(56, 189, 248, 0.2);
      transform: translateY(-2px);
    }
    .mermaid-card:hover .mermaid-overlay {
      opacity: 1;
    }
    .mermaid-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1.25rem;
      background: #111827;
      border-bottom: 1px solid #1e293b;
    }
    .mermaid-card-body {
      padding: 2rem 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: radial-gradient(circle at 50% 30%, #151e33 0%, #0d1322 100%);
      overflow: hidden;
      max-height: 480px;
    }
    .mermaid-card-body svg {
      max-width: 100% !important;
      height: auto !important;
      max-height: 420px !important;
      display: block;
    }

    /* Hover Overlay with Fullscreen Indicator */
    .mermaid-overlay {
      position: absolute;
      inset: 0;
      background: rgba(13, 19, 34, 0.6);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
    }

    /* Force high contrast text on all Mermaid elements */
    .mermaid svg text {
      fill: #f8fafc !important;
      font-weight: 500 !important;
    }
    .mermaid svg .actor {
      fill: #1e293b !important;
      stroke: #60a5fa !important;
      stroke-width: 2px !important;
    }
    .mermaid svg .actor-line {
      stroke: #60a5fa !important;
      stroke-dasharray: 4, 4 !important;
    }
    .mermaid svg .messageLine0, .mermaid svg .messageLine1 {
      stroke: #93c5fd !important;
      stroke-width: 2px !important;
    }
    .mermaid svg .messageText {
      fill: #ffffff !important;
      font-weight: 600 !important;
      stroke: none !important;
    }
    .mermaid svg .labelBox {
      fill: #1e293b !important;
      stroke: #38bdf8 !important;
    }
    .mermaid svg .labelText {
      fill: #ffffff !important;
    }
    .mermaid svg .loopText {
      fill: #f8fafc !important;
    }
    .mermaid svg .loopLine {
      stroke: #38bdf8 !important;
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

    <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
      <span class="text-cyan-400 font-bold">✨ Tip:</span> Haz clic en cualquier diagrama para abrirlo en Fullscreen con Pan & Zoom
    </div>

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

      <div class="pt-4 border-t border-slate-800/80 text-xs text-slate-500 flex flex-col gap-1.5 font-mono">
        <div class="flex items-center gap-1.5 text-slate-400">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <span>CLI: /odg-craft &lt;module&gt;</span>
        </div>
        <div class="text-[11px] text-slate-500">Click en diagrama para Fullscreen</div>
      </div>
    </aside>

    <!-- Center Canvas -->
    <main class="flex-1 overflow-y-auto px-10 py-10 bg-[#080c16]">
      <div class="max-w-4xl mx-auto">
        <div id="loading" class="text-center py-28 text-slate-400 text-base font-medium">
          <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          Cargando arquitectura...
        </div>
        <article id="doc-content" class="markdown-body hidden"></article>
      </div>
    </main>
  </div>

  <!-- Fullscreen Diagram Zoom Modal (ONLY PLACE WITH ACTIVE PAN & ZOOM) -->
  <div id="zoom-modal" class="fixed inset-0 z-50 bg-[#070b16]/98 backdrop-blur-2xl hidden flex-col p-6">
    <div class="flex items-center justify-between pb-4 border-b border-slate-800">
      <div class="flex items-center gap-3">
        <span class="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
        <h3 id="modal-title" class="font-bold text-base text-white tracking-wide">Visor Interactivo en Pantalla Completa</h3>
        <span class="text-xs text-slate-400 border border-slate-800 rounded-md px-2 py-0.5 ml-2 font-mono">Usa la rueda o arrastra para explorar</span>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="modalZoomIn()" class="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition">
          🔍+ Acercar
        </button>
        <button onclick="modalZoomOut()" class="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition">
          🔍- Alejar
        </button>
        <button onclick="modalResetZoom()" class="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition">
          ↺ Centrar
        </button>
        <button onclick="closeModal()" class="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition ml-2 shadow-lg shadow-rose-600/30">
          ✕ Cerrar
        </button>
      </div>
    </div>
    <div id="modal-body" class="flex-1 w-full h-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing p-6">
      <!-- Cloned SVG goes here -->
    </div>
  </div>

  <script>
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
              <span class="text-cyan-400">📄</span>
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
              <div class="mermaid-card" onclick="openModalDiagram('\${diagId}')" title="Haz clic para ver en pantalla completa interactiva">
                <div class="mermaid-card-header">
                  <span class="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-cyan-400"></span> Diagrama \${diagramCounter}
                  </span>
                  <div class="flex items-center gap-2 text-xs font-medium text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded-lg">
                    <span>⛶ Clic para Pantalla Completa</span>
                  </div>
                </div>
                <div class="mermaid-card-body" id="body-\${diagId}">
                  <pre class="mermaid" id="\${diagId}">\${text}</pre>
                </div>
                <div class="mermaid-overlay">
                  <div class="px-4 py-2 rounded-xl bg-blue-600/90 text-white font-bold text-sm shadow-xl flex items-center gap-2 border border-blue-400/30">
                    <span>⛶</span> Abrir en Fullscreen Interactivo
                  </div>
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

    function openModalDiagram(id) {
      const card = document.getElementById('body-' + id);
      const svg = card ? card.querySelector('svg') : null;
      if (!svg) return;

      const modal = document.getElementById('zoom-modal');
      const body = document.getElementById('modal-body');
      body.innerHTML = '';

      const cloneSvg = svg.cloneNode(true);
      cloneSvg.id = 'modal-svg';
      cloneSvg.style.width = '100%';
      cloneSvg.style.height = '100%';
      cloneSvg.style.maxWidth = 'none';
      cloneSvg.style.maxHeight = 'none';
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
        minZoom: 0.1,
        maxZoom: 20,
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

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    window.onload = init;
  </script>
</body>
</html>
`;
}

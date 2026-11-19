# 🌐 The Living Architecture Portal (`odg ui`)

The **ODG Living Architecture Portal** is an embedded, zero-config web application included directly with `odg`. It provides an interactive, dark-mode visual interface to explore your diagrams, zoom into complex lifelines, and read Markdown specifications.

---

## 1. Launching the Portal

From your repository root, run:

```bash
odg ui
```

By default, the server starts at **`http://localhost:4321`**.

You can specify a custom port if needed:
```bash
odg ui --port 8080
```

---

## 2. Key Portal Features

### 📑 Categorized Navigation Sidebar
The left sidebar automatically groups your documentation into clear semantic sections with real-time document counters:
* **📘 Visión General (SOW):** High-level technical scope and C4 context.
* **📋 Requerimientos (SRS):** Actors, functional rules, and NFRs.
* **🏛️ Módulos de Dominio:** Module-by-module domain specifications (`user`, `nutrition`, `training`, `assessment`).
* **🔌 Catálogo de APIs:** Endpoint methods, paths, and DTO schemas.
* **🗄️ Diccionario de Datos:** Database tables, columns, PK/FK constraints, and indexes.
* **⚙️ Runbook Operacional:** Environment variables catalog and local startup instructions.

### 🛡️ 100% Guaranteed Visual Contrast & Blue/Cyan Palette
Every Mermaid diagram rendered in the portal conforms to strict visual rules:
* **Background:** Identical `#090e1a` midnight background across both card previews and fullscreen modals.
* **Nodes & Containers:** Deep navy fill (`#131b2e` / `#0f172a`) with vibrant cyan borders (`#38bdf8`).
* **Lifelines & Signals:** Bright cyan horizontal messages (`#38bdf8`) and sky-blue dashed lifelines (`#60a5fa`).
* **Cardinality Circles:** Hollow ERD relationship rings (`#090e1a` fill, `#38bdf8` stroke) that never obstruct connector text.

### 🔤 Text Contrast Halo Shields
To guarantee that text labels are never obscured when lines or cardinality circles cross them:
1. **SVG Paint Order (`paint-order: stroke fill`):** Every letter is rendered with an integrated 4.5px dark perimeter halo matching the canvas background (`stroke: #090e1a`). Lines passing behind text are cleanly blocked by the halo.
2. **DOM Layering:** All text and `.edgeLabel` nodes are automatically elevated to the topmost layer of the SVG DOM, guaranteeing they are painted on top of all lines and markers.
3. **Pill Badges:** Connectors and relationship labels feature solid dark badges with border outlines.

---

## 3. Interactive Fullscreen Modal with Pan & Zoom

Clicking on any diagram card instantly opens the **High-Definition Fullscreen Visor**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 🔵 Visor Interactivo en Pantalla Completa      [🔍+ Acercar] [🔍- Alejar] [↺ Centrar] [✕ Cerrar] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                    [ Interactive Pan & Zoom Area ]                     │
│               • Scroll mouse wheel to zoom smoothly (0.1x - 20x)       │
│               • Click and drag to pan across large architectures       │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Controls:
* **Mouse Wheel:** Smooth continuous zoom in and out.
* **Click & Drag:** Pan across wide sequence flows and comprehensive ERDs.
* **Toolbar Buttons:** `🔍+ Acercar`, `🔍- Alejar`, and `↺ Centrar` (resets viewport).
* **Keyboard Shortcut:** Press `Escape` (`Esc`) anytime to exit fullscreen.
* **1:1 Visual Parity:** Fullscreen views preserve the exact same styles, fonts, and colors as the card preview without black lines or unstyled nodes.

---

## 4. Intelligent Auto-Scaffolding on Load

When you open the portal:
* The backend reads `.odg/blueprint.json`.
* If any document enabled in your blueprint is missing from `.odg/human/`, `odg ui` automatically scaffolds the document stub with standard headers and tables so it is immediately visible in the sidebar navigation.

---
odg_id: c4_context
title: C4 Context & Container Diagram
category: diagram
diagram_type: c4Diagram
synced_commit: "e3669bb"
---

# C4 Context & Container Diagram — Open Docs Gen (`odg`)

## 1. System Boundary Overview
`odg` opera como el orquestador central local que analiza la base de código del usuario, gestiona el estado en `.odg/` y expone capacidades hacia herramientas de IA externas y la interfaz de usuario local.

## 2. Interactive C4 Context Diagram
```mermaid
graph TB
    User["Desarrollador / Arquitecto"]
    
    subgraph SystemBoundary["Open Docs Gen (odg)"]
        CLI["CLI Command Center<br/>(citty + @clack/prompts)"]
        Catalog["Catalog & Boilerplates Registry<br/>(17 Standard Recipes)"]
        Transpiler["Multi-CLI Transpiler<br/>(15+ Adapters)"]
        Store[(".odg/ State Store<br/>(blueprint.json + radar-manifest.json)")]
    end
    
    subgraph ExternalAgents["AI Coding Tools & CLIs"]
        Agy["Antigravity CLI (agy)"]
        Claude["Claude Code (claude)"]
        Copilot["GitHub Copilot"]
        Codex["Codex / Gemini / Cursor"]
    end

    User -->|Ejecuta odg init / blueprint / pulse| CLI
    CLI --> Catalog
    CLI --> Transpiler
    CLI --> Store
    Transpiler -->|Instala Workflows / Skills| ExternalAgents
    ExternalAgents -->|Lee e interactúa con specs| Store
```

## 3. Container & Services Inventory
| Container / Service | Technology | Responsibility | Data Store / Port |
| :--- | :--- | :--- | :--- |
| **CLI Runner** | Node.js (citty) | Punto de entrada de comandos de terminal interactivos. | CLI args |
| **Catalog Engine** | TypeScript | Almacena definiciones canónicas de diagramas y documentos. | In-memory |
| **Integrations Transpiler** | TypeScript / FS | Escribe los comandos `/odg` y skills para cada CLI de IA. | Local files (`.agents/`, `.claude/`, etc.) |
| **Artifacts Repository** | File System (Markdown + JSON) | Mantiene el estado incremental y documentación humana/IA. | `.odg/` |

<!-- odg:refs:start -->
## 4. Cross-References
| Container | Domain Modules | External APIs | Status |
| :--- | :--- | :--- | :--- |
| CLI Runner | `[[mod:cli]]` | Terminal `odg` | 🟢 Full Spec |
| Catalog Engine | `[[mod:catalog]]` | Types & Recipes | 🟢 Full Spec |
| Transpiler | `[[mod:integrations]]` | AI Tool Files | 🟢 Full Spec |
<!-- odg:refs:end -->

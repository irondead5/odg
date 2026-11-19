# 🛠️ Complete ODG CLI & Command Reference

This document provides an exhaustive reference for every command in the **Open Docs Gen (`odg`)** CLI and its corresponding AI Agent slash commands.

---

## 📑 Command Quick Navigation

| CLI Command | AI Slash Command | Primary Responsibility | Token Cost |
| :--- | :--- | :--- | :---: |
| [`odg init`](#1-odg-init) | — | Interactive project configuration & AI setup | `0 tokens` |
| [`odg blueprint`](#2-odg-blueprint) | [`/odg-blueprint`](#odg-blueprint-ai) | View & toggle active diagrams & documents | `0 tokens` |
| [`odg radar`](#3-odg-radar) | [`/odg-radar`](#odg-radar-ai) | 0-token AST module & token budget discovery | `0 tokens` |
| [`odg craft`](#4-odg-craft) | [`/odg-craft`](#odg-craft-ai) | Deep synthesize architecture documentation & Mermaid | Targeted |
| [`odg pulse`](#5-odg-pulse) | [`/odg-pulse`](#odg-pulse-ai) | Real-time coverage % and drift audit | `0 tokens` |
| [`odg sweep`](#6-odg-sweep) | [`/odg-sweep`](#odg-sweep-ai) | Bidirectional cross-reference & backlink reconciliation | `0 tokens` |
| [`odg ui`](#7-odg-ui) | — | Embedded living architecture web portal with Pan & Zoom | `0 tokens` |
| [`odg update`](#8-odg-update) | — | Re-transpile AI agent skills across tools | `0 tokens` |

---

## 1. `odg init`

### Purpose & Overview
`odg init` is the interactive onboarding wizard that bootstraps `odg` inside any existing codebase. It detects your environment, configures your architectural blueprint, auto-scaffolds the document suite directory structure, and transpiles native integrations for your AI tools.

### Syntax
```bash
odg init [--preset <recommended | enterprise | mvp | custom>]
```

### Options & Flags
* `--preset <preset>`: Skips the interactive preset selection prompt and applies the chosen preset configuration directly.

### Detailed Lifecycle (What Happens Under the Hood)
1. **Preset Selection:** Prompts you to pick one of 4 architecture presets:
   * **⚡ Recommended Standard:** Core diagrams (ERD, Use Cases, C4, Sequence) + Essential documents (SOW, SRS, APIs, Data Dictionary, Runbook).
   * **🏢 Full Enterprise:** All 8 visual diagrams + All 9 written documents (including ADRs, Technical Debt Audit, Security Matrix).
   * **🚀 Lean / MVP:** C4, ERD + Technical SOW, Module Specs, and Env Runbook.
   * **🎛️ Custom:** Interactive checklist to toggle each diagram and document individually.
2. **Referential Knowledge Base Mode:** Configures `auto_zero_token` post-hook for automatic link updates.
3. **AI CLI Integration:** Installs native skills, slash commands, and prompts for your selected tools (**Google Antigravity CLI**, **Claude Code**, **GitHub Copilot**, etc.).
4. **Configuration Artifact:** Saves the full schema to `.odg/blueprint.json`.
5. **Auto-Scaffolding:** Creates `.odg/human/` and writes starter document stubs for all enabled documents (`01-overview/technical-sow.md`, `02-requirements/requirements-srs.md`, `04-api/api-contracts.md`, `05-data/data-dictionary.md`, `06-ops/env-runbook.md`).

### When to Use
Run this command once when introducing `odg` to a new or existing repository.

---

## 2. `odg blueprint`

### Purpose & Overview
`odg blueprint` lets you inspect, audit, and modify which architectural artifacts are active in your repository without manually editing JSON files.

### Syntax
```bash
odg blueprint
```

### Detailed Lifecycle
1. Reads `.odg/blueprint.json` from the repository root.
2. Renders two structured terminal tables:
   * **Section 1: Visual Diagrams (Mermaid.js):** Displays status (`Enabled` / `Disabled`) and descriptions for all 8 diagram types (ERD, Use Cases, C4, Sequence, State Machines, Class Domain, Event Architecture, Infra Topology).
   * **Section 2: Written Documentation (Markdown):** Displays status and descriptions for all 9 document types (SOW, SRS, Module Specs, API Contracts, Data Dictionary, Env Runbook, ADRs, Tech Debt, Security Matrix).
3. Prompts whether you want to toggle any diagram or document on or off.
4. Updates `.odg/blueprint.json` and synchronizes the scaffolded directories in `.odg/human/`.

### When to Use
Use whenever you want to expand your documentation suite (e.g., adding an ADR or a State Machine diagram) or disable unneeded sections for smaller projects.

---

## 3. `odg radar`

### Purpose & Overview
`odg radar` is the zero-token AST discovery engine. It deterministically analyzes your codebase structure in milliseconds without sending any code to an LLM, generating token estimates and preparing the documentation suite.

### Syntax
```bash
odg radar [--quiet]
```

### Options & Flags
* `--quiet`: Suppresses the terminal table output. Useful in CI/CD pipelines or Git `post-commit` hooks.

### Detailed Lifecycle
1. **Source Discovery:** Scans the `src/` directory (ignoring caches like `__pycache__`, `node_modules`, `.git`).
2. **AST Metrics:** Computes file count, total lines of code, and estimated LLM token weight per module.
3. **Domain Classification:** Classifies each folder as a `domain_module` or `shared_infrastructure`.
4. **Coverage Audit:** Checks whether `.odg/human/03-domains/<module>.md` exists to calculate documentation coverage.
5. **Auto-Scaffolding:** Verifies that all enabled blueprint documents exist in `.odg/human/`, creating missing stubs automatically.
6. **Manifest Generation:** Writes the full state into `.odg/radar-manifest.json`.

### Terminal Output Example
```text
🔍 Open Docs Gen (odg radar) — Architectural Discovery
   Scanned: /workspace/src

┌────────────────────┬──────────┬───────────┬───────────────────┬──────────────┐
│ Módulo             │ Archivos │ Líneas     │ Tokens Estimados   │ Estado        │
├────────────────────┼──────────┼───────────┼───────────────────┼──────────────┤
│ user               │ 7        │ 771       │ 7325              │ Documentado    │
│ nutrition          │ 7        │ 2279      │ 21651             │ Pendiente      │
│ training           │ 7        │ 3074      │ 29203             │ Pendiente      │
│ assessment         │ 7        │ 529       │ 5026              │ Pendiente      │
└────────────────────┴──────────┴───────────┴───────────────────┴──────────────┘

📊 Cobertura actual: 25% (1/4 módulos documentados)
   Suite de documentos sincronizada en .odg/human/
```

### When to Use
Run before starting documentation to see token budgets, or after adding new source files to refresh the architecture manifest.

---

## 4. `odg craft`

### Purpose & Overview
`odg craft` is the synthesis engine that generates rich, verified Markdown documentation and Mermaid v11 diagrams.

### Syntax
```bash
odg craft [target] [--all]
```

### Positional Arguments
* `target`: The name of a specific module (e.g. `user`, `nutrition`, `training`, `assessment`) or a global document key (e.g. `sow`, `srs`, `api`, `data`, `env`).

### Options & Flags
* `--all`: Synthesizes documentation for all pending discovered modules and enabled global documents in a single automated pass.

### What It Generates

#### For Domain Modules (`odg craft <module>`):
Generates `.odg/human/03-domains/<module>.md` containing:
* **1. Executive Summary & Purpose:** Scope and domain boundaries.
* **2. Architecture & Design Patterns:** Repository patterns, dependency injection, and compensating transactions.
* **3. Complete Mermaid v11 Diagram Suite:**
  * **3.1 C4 Component Diagram (`graph TD`):** Internal API routers, service repositories, external services, and databases.
  * **3.2 Entity-Relationship Diagram (`erDiagram`):** Tables, typed columns, and PK/FK relationships with hollow non-occluding cardinality rings.
  * **3.3 Use Case Diagram (`flowchart LR`):** Bounded domain subgraphs and rounded actors (`UserActor((...))`).
  * **3.4 Sequence Flow (`sequenceDiagram`):** Request/response flows with autonumbering, lifelines, and `alt/else` compensating error handling.
* **4. Component & Source File Map:** Table detailing every file in the module and its key classes/functions.

#### For Global Documents:
* `odg craft sow` ➔ `.odg/human/01-overview/technical-sow.md` (Scope of work, tech stack matrix, and C4 context).
* `odg craft srs` ➔ `.odg/human/02-requirements/requirements-srs.md` (Roles, access matrix, and functional rules catalog).
* `odg craft api` ➔ `.odg/human/04-api/api-contracts.md` (Endpoint schemas, methods, auth guards, DTOs).
* `odg craft data` ➔ `.odg/human/05-data/data-dictionary.md` (Table specifications, columns, types, indexes).
* `odg craft env` ➔ `.odg/human/06-ops/env-runbook.md` (Env variables catalog, secrets, local startup guide).

### When to Use
Run whenever you need to document a new module or generate the complete documentation suite.

---

## 5. `odg pulse`

### Purpose & Overview
`odg pulse` gives you an instant, lightweight healthcheck of your architectural documentation coverage and detects drift between your source code and documentation.

### Syntax
```bash
odg pulse
```

### Detailed Lifecycle
1. Reads `.odg/radar-manifest.json` and checks file timestamps against Git status.
2. Computes:
   * **Total Architecture Coverage %**
   * **Diagram Coverage %**
   * **Document Suite Coverage %**
3. Flags any drifted files requiring resynchronization.

### Terminal Output Example
```text
📊 ODG PULSE — Estado de Cobertura de Arquitectura:
  🎯 Cobertura Total:     100%
  📐 Diagramas Cubiertos: 100%
  📝 Documentos Cubiertos: 100%
```

### When to Use
Run before pull requests or commits to verify that all code changes have corresponding architectural documentation.

---

## 6. `odg sweep`

### Purpose & Overview
`odg sweep` is the referential link reconciler. It scans all Markdown files in `.odg/human/`, parses canonical link tags (`<!-- odg:refs -->`), and reconciles cross-document references, requirement traceability matrices, and backlinks with zero token cost.

### Syntax
```bash
odg sweep [--ai]
```

### Options & Flags
* `--ai`: Triggers an optional deep semantic cross-document validation pass in addition to deterministic canonical linking.

### Detailed Lifecycle
1. Scans all `.md` files in `.odg/human/`.
2. Inspects canonical entity references (`[[req:FR-*]]`, `[[api:...]]`, `[[tbl:...]]`).
3. Updates the `Cross-References & Traceability Matrix` table at the end of each document, verifying that linked endpoints, tables, and requirements exist and point to valid paths.

### When to Use
Run after crafting multiple modules to ensure all bidirectional links between documents are synchronized.

---

## 7. `odg ui`

### Purpose & Overview
`odg ui` launches the embedded local living architecture web application. It renders your entire documentation suite in an interactive dark-mode portal with high-definition Mermaid diagrams, text contrast protection, and an interactive pan & zoom modal visor.

### Syntax
```bash
odg ui [--port <port>]
```

### Options & Flags
* `--port <number>`: Port number to host the local HTTP server (default: `4321`).

### Portal Capabilities
* **Categorized Navigation:** Groups documents into Overview (SOW), Requirements (SRS), Domain Modules, APIs, Data Dictionaries, and Ops Runbooks.
* **Auto-Scaffolding:** Auto-creates any enabled blueprint document stubs if missing.
* **High-Contrast Mermaid v11 Palette:** Guaranteed cyan/blue styling (`#38bdf8` / `#60a5fa` / `#131b2e` / `#090e1a`) with 1:1 visual parity between preview cards and fullscreen.
* **Text Contrast Halo Shields:** `paint-order: stroke fill` with 4.5px perimeters ensures text is never occluded by intersecting lines or symbols.
* **Interactive Pan & Zoom:** Click any diagram to open fullscreen with continuous mouse wheel zooming (0.1x to 20x), drag-to-pan, and `Esc` to close.

### When to Use
Run whenever you or your team want to visually explore, review, or present system architecture.

---

## 8. `odg update`

### Purpose & Overview
`odg update` re-transpiles and synchronizes native AI skills, slash commands, and workflows across all supported AI coding tools and IDEs.

### Syntax
```bash
odg update
```

### What It Synchronizes
* Local workspace integrations (`.agents/`, `.claude/`, `.github/`).
* Global user configuration directories (e.g. `~/.gemini/config/skills/`).

### When to Use
Run after updating the `odg` CLI package or after modifying `.odg/blueprint.json` to ensure your AI assistants have the latest skill prompts.

---

## 🤖 AI Assistant Slash Commands Reference

When working inside AI tools like **Google Antigravity CLI (`agy`)**, **Claude Code**, or **GitHub Copilot**, use these native slash commands directly in the conversation:

### `/odg`
Opens the interactive architecture command center and displays active coverage and next steps.

### `/odg-radar`
Executes zero-token discovery, scans `src/`, updates the radar manifest, and scaffolds document stubs.

### `/odg-craft <module | sow | api | all>`
Synthesizes full architecture documentation and Mermaid v11 diagrams for the specified target.

### `/odg-blueprint`
Allows you to view and toggle active diagrams and documents through interactive conversation.

### `/odg-pulse`
Returns the current coverage percentages and checks for architectural drift.

### `/odg-sweep`
Reconciles all cross-references, requirement tags, and backlink tables across your documentation files.

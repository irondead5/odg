# 🛠️ ODG CLI Command Reference

Comprehensive reference guide for all commands available in the `odg` (Open Docs Gen) CLI.

---

## Command Summary

| Command | Purpose | Token Cost | Output Artifacts |
| :--- | :--- | :--- | :--- |
| [`odg init`](#odg-init) | Interactive setup wizard & preset selector | `0 tokens` | `.odg/blueprint.json`, `.agents/`, `.odg/human/` |
| [`odg blueprint`](#odg-blueprint) | View or toggle active diagrams and documents | `0 tokens` | `.odg/blueprint.json` |
| [`odg radar`](#odg-radar) | Discover modules, bounded contexts, and budgets | `0 tokens` | `.odg/radar-manifest.json`, scaffolded stubs |
| [`odg craft`](#odg-craft) | Deep synthesize architecture specs & Mermaid diagrams | Targeted | `.odg/human/03-domains/*.md`, global specs |
| [`odg pulse`](#odg-pulse) | Instant healthcheck of coverage % and drift | `0 tokens` | Terminal coverage report |
| [`odg sweep`](#odg-sweep) | Reconcile cross-document references & backlinks | `0 tokens` | Updated traceability tables across `.odg/human/` |
| [`odg ui`](#odg-ui) | Start embedded living architecture portal | `0 tokens` | Web server on `http://localhost:4321` |
| [`odg update`](#odg-update) | Re-transpile AI agent skills and slash commands | `0 tokens` | Updated agent workflows & skills |

---

## `odg init`
Launches the interactive CLI wizard to configure your project's architectural blueprint and AI agent integrations.

```bash
odg init [--preset <preset>]
```

### Options:
* `--preset <recommended | enterprise | mvp | custom>`: Pre-selects a preset without opening the first menu.

### Example:
```bash
odg init
```

---

## `odg blueprint`
Inspects or modifies the active diagrams and documents defined in `.odg/blueprint.json`.

```bash
odg blueprint
```

* Displays Section 1: Mermaid Visual Diagrams with their active/disabled status.
* Displays Section 2: Written Documentation Specifications with their active/disabled status.
* Prompts to toggle items on/off interactively.

---

## `odg radar`
Fast, deterministic scanner that crawls your source code (e.g. `src/`) to identify modules, calculate lines of code, estimate token budgets, and scaffold the enabled document suite.

```bash
odg radar [--quiet]
```

### Options:
* `--quiet`: Suppresses verbose table output and logs minimal status.

### Example Output:
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

---

## `odg craft`
Generates deep architectural documentation and Mermaid v11 diagrams for a target module, a global specification, or the entire codebase.

```bash
odg craft [target] [--all]
```

### Positional Arguments:
* `target`: The name of the module (e.g. `user`, `nutrition`, `training`) or global document (e.g. `sow`, `srs`, `api`, `data`, `env`).

### Options:
* `--all`: Synthesizes documentation for all discovered modules and enabled global documents.

### Examples:
```bash
# Document a specific domain module:
odg craft user

# Document global API contracts:
odg craft api

# Synthesize all pending modules at once:
odg craft --all
```

---

## `odg pulse`
Displays an instant snapshot of your architecture coverage metrics and identifies drift between code and documentation.

```bash
odg pulse
```

### Output:
```text
📊 ODG PULSE — Estado de Cobertura de Arquitectura:
  🎯 Cobertura Total:     100%
  📐 Diagramas Cubiertos: 100%
  📝 Documentos Cubiertos: 100%
```

---

## `odg sweep`
Scans all `.md` files in `.odg/human/` and updates bidirectional cross-references (`<!-- odg:refs:start -->` blocks) to maintain complete traceability between Requirements, Use Cases, Sequence Flows, APIs, and ERD tables.

```bash
odg sweep [--ai]
```

### Options:
* `--ai`: Enables semantic cross-document validation in addition to deterministic canonical linking.

---

## `odg ui`
Spins up the embedded dark-mode architecture portal.

```bash
odg ui [--port <port>]
```

### Options:
* `--port <number>`: Port number to bind the HTTP server (default: `4321`).

### Features:
* Categorized navigation sidebar (`01-overview`, `02-requirements`, `03-domains`, `04-api`, `05-data`, `06-ops`).
* High-definition Mermaid v11 rendering with guaranteed blue/cyan contrast (`#38bdf8` / `#60a5fa`).
* Interactive fullscreen modal with smooth Pan & Zoom (`svg-pan-zoom`).
* Automatic text contrast halo shield (`paint-order: stroke fill`).
* Auto-scaffolds missing enabled blueprint documents on load.

---

## `odg update`
Regenerates and synchronizes slash commands, prompts, and skills across your configured AI tools (`.agents/`, `.claude/`, `.github/`).

```bash
odg update
```

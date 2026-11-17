---
odg_id: technical_sow
title: Technical Scope of Work (SOW)
category: document
scope: global
synced_commit: "e3669bb"
coverage_status: "in_sync"
---

# Technical Scope of Work (SOW) — Open Docs Gen (`odg`)

## 1. Executive Summary & System Purpose
**Open Docs Gen (`odg`)** es un framework de documentación arquitectónica local y agnóstico de herramientas de IA, inspirado en flujos guiados por especificaciones (estilo OpenSpec). Combina análisis estático determinista (AST) con síntesis incremental asistida por LLMs para generar diagramas interactivos en Mermaid.js, documentación técnica estandarizada y artefactos de contexto ultra-compactos para agentes de código.

## 2. System Boundaries & Architecture Scope
El sistema se delimita a la inspección estática del código fuente local, gestión de estado incremental en `.odg/`, compilación determinista hacia diagramas Mermaid y Markdown, y sincronización nativa de comandos hacia más de 15 CLIs y entornos de IA.

### 2.1 Technology Stack & Runtime Matrix (AST Verified)
| Layer | Detected Packages / Frameworks | Version | Entrypoints |
| :--- | :--- | :--- | :--- |
| Core Runtime | Node.js / Bun (TypeScript) | >= 20.0.0 | `src/index.ts` |
| CLI Engine | `citty` + `@clack/prompts` | ^0.1.6 / ^0.9.1 | `bin/odg.mjs`, `src/cli/index.ts` |
| Build Tooling | `tsup` + `typescript` | ^8.5.1 / ^5.9.3 | `tsup.config.ts` |
| Validation | `zod` | ^3.25.76 | `src/catalog/types.ts` |

## 3. Implemented Capabilities by Domain Module
| Domain Module | Path | Files | Key Capabilities & Deliverables | Status |
| :--- | :--- | :--- | :--- | :--- |
| **`catalog`** | `src/catalog/` | 19 | Catálogo canónico de los 8 diagramas y 9 documentos, presets (`recommended`, `enterprise`, `mvp`) y boilerplates Markdown. | Full Spec |
| **`cli`** | `src/cli/` | 5 | Subcomandos `init`, `blueprint`, `pulse`, `update` construidos con menús interactivos `@clack/prompts`. | Full Spec |
| **`integrations`** | `src/integrations/` | 2 | Transpilador multi-herramienta que genera comandos y skills para 15+ AI CLIs (Antigravity, Claude, Copilot, Codex, etc.). | Full Spec |

## 4. External Integrations & Third-Party SDKs
| Integration / SDK | Used In Module | Purpose & Data Exchanged | Auth Mechanism |
| :--- | :--- | :--- | :--- |
| **Antigravity CLI** | `src/integrations/transpiler.ts` | Registra workflows en `.agents/workflows/odg.md` y skills en `.agents/skills/odg/`. | Local File / Zero Auth |
| **Claude Code** | `src/integrations/transpiler.ts` | Registra comandos en `.claude/commands/odg/` y skills en `.claude/skills/odg/`. | Local File / Zero Auth |
| **GitHub Copilot** | `src/integrations/transpiler.ts` | Registra prompts en `.github/prompts/odg.prompt.md` y skills en `.github/skills/odg/`. | Local File / Zero Auth |

## 5. Non-Functional Constraints, Assumptions & Out-of-Scope
### 5.1 Operational Constraints & SLAs
- **Tiempo de escaneo determinista:** < 100ms en repositorios medianos.
- **Consumo de tokens de LLM:** 0 tokens para la fase de escaneo, catálogo y generación de boilerplates.
- **Portabilidad:** 100% ejecutable localmente sin servidores remotos obligatorios.

### 5.2 Detected Architectural Limitations / Out-of-Scope
- No realiza ejecución dinámica de tests en runtime ni profiling de memoria; se enfoca exclusivamente en análisis estático y arquitectura documental.

<!-- odg:refs:start -->
## 6. Cross-References & Traceability Matrix
| Source Section | Target Canonical ID | Target Description | Status |
| :--- | :--- | :--- | :--- |
| §3 Implemented Capabilities | `[[mod:catalog]]` | Catálogo y boilerplates canónicos | 🟢 Full Spec |
| §3 Implemented Capabilities | `[[mod:cli]]` | Motor de interfaz por línea de comandos | 🟢 Full Spec |
| §3 Implemented Capabilities | `[[mod:integrations]]` | Transpilador multi-CLI y agentes de IA | 🟢 Full Spec |
| §4 External Integrations | `[[api:cli:odg]]` | Ejecutable principal bin/odg.mjs | 🟢 Full Spec |
<!-- odg:refs:end -->

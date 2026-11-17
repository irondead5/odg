---
odg_id: module_specs
title: Deep Module Specification
category: document
scope: module
synced_commit: "e3669bb"
---

# Module Specification: `integrations`

## 1. Domain Purpose & Responsibilities
El módulo `integrations` implementa la arquitectura de **Transpilador Universal de Comandos de IA** (estilo OpenSpec). Adapta las capacidades de `odg` para que se invoquen transparentemente desde más de 15 CLIs, IDEs y agentes (Antigravity, Claude Code, GitHub Copilot, Codex, Gemini, Cursor, etc.).

## 2. Exported Interfaces & Public API
| Symbol / Class / Function | Signature | File Reference | Responsibility |
| :--- | :--- | :--- | :--- |
| `SUPPORTED_AI_TOOLS` | `Record<AiToolId, ToolAdapter>` | `src/integrations/adapters.ts:12` | Diccionario de patrones de comandos, rutas de workflows y skills. |
| `installToolIntegrations` | `(tools: AiToolId[]) => Promise<string[]>` | `src/integrations/transpiler.ts:6` | Genera físicamente los archivos de slash commands y skills en el repo. |

## 3. Business Invariants & State Transitions
- **Invariante 1:** Cada archivo de workflow generado debe referenciar `.odg/blueprint.json` para no ejecutar recetas desactivadas.
- **Invariante 2:** El transpilador debe respetar las convenciones de formato de cada herramienta (`.prompt.md` en Copilot, `.toml` en Gemini, `.md` en Antigravity y Claude).

## 4. Dependencies & Blast Radius
- **Internal Imports:** `src/catalog/types.ts`.
- **External Packages:** `node:fs/promises`, `node:path`.

<!-- odg:refs:start -->
## 5. Cross-References & Traceability
| Relation | Target Canonical ID | Target Description | Status |
| :--- | :--- | :--- | :--- |
| Configura | `[[api:workflows:odg]]` | Comandos en `.agents/workflows/odg.md` | 🟢 Full Spec |
| Invocado por | `[[mod:cli]]` | Subcomandos init y update | 🟢 Full Spec |
<!-- odg:refs:end -->

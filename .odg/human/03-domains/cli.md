---
odg_id: module_specs
title: Deep Module Specification
category: document
scope: module
synced_commit: "e3669bb"
---

# Module Specification: `cli`

## 1. Domain Purpose & Responsibilities
El módulo `cli` provee la interfaz por línea de comandos e interactiva para el usuario humano. Maneja el ciclo de vida del comando raíz `odg`, los menús de casillas (`@clack/prompts`) y la salida formateada con `picocolors`.

## 2. Exported Interfaces & Public API
| Symbol / Class / Function | Signature | File Reference | Responsibility |
| :--- | :--- | :--- | :--- |
| `mainCommand` | `CommandDef` | `src/cli/index.ts:7` | Comando raíz `odg` con subcomandos `init`, `blueprint`, `pulse`, `update`. |
| `initCommand` | `CommandDef` | `src/cli/commands/init.ts:20` | Wizard de 5 pasos para configuración inicial del repositorio. |
| `blueprintCommand` | `CommandDef` | `src/cli/commands/blueprint.ts:13` | Selector interactivo de diagramas y documentos (Check/Uncheck). |
| `pulseCommand` | `CommandDef` | `src/cli/commands/pulse.ts:6` | Reporte visual de % de cobertura y *Next Steps*. |
| `updateCommand` | `CommandDef` | `src/cli/commands/update.ts:7` | Sincronización de integraciones de IA. |

## 3. Business Invariants & State Transitions
- **Invariante 1:** `odg init` y `odg blueprint` nunca deben sobrescribir un `.odg/blueprint.json` sin preservar las preferencias activas del usuario a menos que se fuerce.
- **Invariante 2:** La cancelación del usuario (`Ctrl+C` en `@clack/prompts`) debe salir limpiamente con código 0 sin corromper archivos parciales.

## 4. Dependencies & Blast Radius
- **Internal Imports:** `src/catalog/registry.ts`, `src/integrations/transpiler.ts`.
- **External Packages:** `citty`, `@clack/prompts`, `picocolors`.

<!-- odg:refs:start -->
## 5. Cross-References & Traceability
| Relation | Target Canonical ID | Target Description | Status |
| :--- | :--- | :--- | :--- |
| Usa | `[[mod:catalog]]` | Definiciones de diagramas y documentos | 🟢 Full Spec |
| Usa | `[[mod:integrations]]` | Generación de skills y workflows | 🟢 Full Spec |
<!-- odg:refs:end -->

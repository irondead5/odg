---
odg_id: module_specs
title: Deep Module Specification
category: document
scope: module
synced_commit: "e3669bb"
---

# Module Specification: `catalog`

## 1. Domain Purpose & Responsibilities
El módulo `catalog` actúa como la **Fuente Única de Verdad (Single Source of Truth)** de `odg`. Define el tipado estricto, el registro canónico de los 8 diagramas Mermaid y 9 documentos Markdown, y aloja las plantillas de boilerplates canónicos.

## 2. Exported Interfaces & Public API
| Symbol / Class / Function | Signature | File Reference | Responsibility |
| :--- | :--- | :--- | :--- |
| `DIAGRAM_DEFINITIONS` | `Record<DiagramId, CatalogItemDefinition>` | `src/catalog/registry.ts:10` | Metadatos y nombres oficiales de los 8 diagramas. |
| `DOCUMENT_DEFINITIONS` | `Record<DocumentId, CatalogItemDefinition>` | `src/catalog/registry.ts:60` | Metadatos y nombres oficiales de los 9 documentos. |
| `createDefaultBlueprint` | `(preset?: string) => OdgBlueprintConfig` | `src/catalog/registry.ts:115` | Factoría de configuración para presets (`recommended`, `enterprise`, `mvp`). |
| `OdgBlueprintConfig` | `interface` | `src/catalog/types.ts:35` | Esquema tipado de `.odg/blueprint.json`. |

## 3. Business Invariants & State Transitions
- **Invariante 1:** Los IDs canónicos de diagramas y documentos son inmutables para no romper enlaces referenciales.
- **Invariante 2:** Cada documento y diagrama activo debe tener un `.boilerplate.md` correspondiente en `src/catalog/boilerplates/`.

## 4. Dependencies & Blast Radius
- **Internal Imports:** Ninguno (módulo hoja fundamental).
- **External Packages:** `zod` para validación opcional de esquemas.

<!-- odg:refs:start -->
## 5. Cross-References & Traceability
| Relation | Target Canonical ID | Target Description | Status |
| :--- | :--- | :--- | :--- |
| Configura | `[[tbl:BLUEPRINT_CONFIG]]` | Esquema del archivo de configuración | 🟢 Full Spec |
| Consumido por | `[[mod:cli]]` | Wizard interactivo init y blueprint | 🟢 Full Spec |
<!-- odg:refs:end -->

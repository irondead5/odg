---
odg_id: use_cases
title: Use Case Diagram
category: diagram
diagram_type: usecaseDiagram
synced_commit: "e3669bb"
---

# Use Case Diagram — Open Docs Gen (`odg`)

## 1. System Capabilities & Actors
El sistema contempla dos actores principales: el **Desarrollador / Usuario Humano** y el **Agente de IA (CLI / Copilot / IDE)**.

## 2. Interactive Use Case Diagram
```mermaid
graph LR
    Dev["Desarrollador"]
    AI["Agente de IA (CLI / IDE)"]

    subgraph ODG["Casos de Uso ODG"]
        UC1["Configurar Blueprint de Documentación<br/>(odg init / odg blueprint)"]
        UC2["Revisar Cobertura y Drift<br/>(odg pulse)"]
        UC3["Actualizar Integraciones de Herramientas<br/>(odg update)"]
        UC4["Descubrir y Documentar Módulos<br/>(odg radar / odg craft)"]
        UC5["Navegar Base de Conocimiento Referencial<br/>(odg sweep / odg ui)"]
    end

    Dev --> UC1
    Dev --> UC2
    Dev --> UC3
    Dev --> UC5
    AI --> UC2
    AI --> UC4
    AI --> UC5
```

## 3. Actor Capabilities Matrix
| Actor / Role | Permitted Use Cases | Preconditions | Auth Guard |
| :--- | :--- | :--- | :--- |
| Desarrollador | Configurar Blueprint, Revisar Cobertura, Actualizar Herramientas | Node.js instalado, repositorio local | CLI / Local permissions |
| Agente de IA | Consultar Radar, Generar Módulos, Resolver Referencias | Archivos de comandos y skills instalados | File access |

<!-- odg:refs:start -->
## 4. Cross-References
| Use Case | Associated Requirement | Triggering Route | Status |
| :--- | :--- | :--- | :--- |
| Configurar Blueprint | `[[req:FR-01-blueprint]]` | `odg blueprint` | 🟢 Full Spec |
| Revisar Cobertura | `[[req:FR-02-pulse]]` | `odg pulse` | 🟢 Full Spec |
| Sincronizar Herramientas | `[[req:FR-03-update]]` | `odg update` | 🟢 Full Spec |
<!-- odg:refs:end -->

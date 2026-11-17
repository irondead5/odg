---
odg_id: c4_context
title: C4 Context & Container Diagram
category: diagram
diagram_type: c4Diagram
synced_commit: "{{ast:git_head}}"
---

# C4 Context & Container Diagram — {{ast:project_name}}

## 1. System Boundary Overview
{{slot:c4_system_overview}}

## 2. Interactive C4 Context Diagram
```mermaid
graph TB
{{ast:compiled_mermaid_c4_context}}
```

## 3. Container & Services Inventory
| Container / Service | Technology | Responsibility | Data Store / Port |
| :--- | :--- | :--- | :--- |
{{ast:c4_containers_table_rows}}

<!-- odg:refs:start -->
## 4. Cross-References
| Container | Domain Modules | External APIs | Status |
| :--- | :--- | :--- | :--- |
{{ast:traceability_rows}}
<!-- odg:refs:end -->

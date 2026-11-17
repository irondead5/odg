---
odg_id: erd
title: Entity-Relationship Diagram (ERD)
category: diagram
diagram_type: erDiagram
synced_commit: "{{ast:git_head}}"
---

# Entity-Relationship Diagram (ERD)

## 1. Architectural Data Model Overview
{{slot:data_model_summary}}

## 2. Interactive Entity-Relationship Diagram
```mermaid
erDiagram
{{ast:compiled_mermaid_erd}}
```

## 3. Relationships & Cardinality Matrix
| Parent Entity | Child Entity | Cardinality | Foreign Key / Join | Cascade & Integrity Rule |
| :--- | :--- | :--- | :--- | :--- |
{{ast:erd_relationships_table_with_slots}}

<!-- odg:refs:start -->
## 4. Cross-References
| Table | Module Owner | Associated Requirements | Status |
| :--- | :--- | :--- | :--- |
{{ast:traceability_rows}}
<!-- odg:refs:end -->

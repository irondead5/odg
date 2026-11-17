---
odg_id: use_cases
title: Use Case Diagram
category: diagram
diagram_type: usecaseDiagram
synced_commit: "{{ast:git_head}}"
---

# Use Case Diagram — {{ast:target_name}}

## 1. System Capabilities & Actors
{{slot:use_cases_overview}}

## 2. Interactive Use Case Diagram
```mermaid
graph LR
{{ast:compiled_mermaid_use_cases}}
```

## 3. Actor Capabilities Matrix
| Actor / Role | Permitted Use Cases | Preconditions | Auth Guard |
| :--- | :--- | :--- | :--- |
{{ast:actor_capabilities_table_rows}}

<!-- odg:refs:start -->
## 4. Cross-References
| Use Case | Associated Requirement | Triggering Route | Status |
| :--- | :--- | :--- | :--- |
{{ast:traceability_rows}}
<!-- odg:refs:end -->

---
odg_id: class_domain
title: Class & Domain Model Diagram
category: diagram
diagram_type: classDiagram
synced_commit: "{{ast:git_head}}"
---

# Class & Domain Model — {{ast:target_name}}

## 1. Domain Structure Overview
{{slot:domain_model_overview}}

## 2. Interactive Class Diagram
```mermaid
classDiagram
{{ast:compiled_mermaid_class_domain}}
```

## 3. Entity & Value Object Catalog
| Class / Entity | Stereotype | Injected Dependencies | Methods |
| :--- | :--- | :--- | :--- |
{{ast:class_entities_table_rows}}

<!-- odg:refs:start -->
## 4. Cross-References
| Entity | Module | Database Table | Status |
| :--- | :--- | :--- | :--- |
{{ast:traceability_rows}}
<!-- odg:refs:end -->

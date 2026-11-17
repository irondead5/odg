---
odg_id: module_specs
title: Deep Module Specification
category: document
scope: module
synced_commit: "{{ast:git_head}}"
---

# Module Specification: {{ast:module_name}}

## 1. Domain Purpose & Responsibilities
{{slot:module_purpose}}

## 2. Exported Interfaces & Public API
| Symbol / Class / Function | Signature | File Reference | Responsibility |
| :--- | :--- | :--- | :--- |
{{ast:exported_symbols_table}}

## 3. Business Invariants & State Transitions
{{slot:invariants_and_rules}}

## 4. Dependencies & Blast Radius
- **Internal Imports:** {{ast:internal_dependencies_list}}
- **External Packages:** {{ast:external_packages_list}}

<!-- odg:refs:start -->
## 5. Cross-References & Traceability
| Relation | Target Canonical ID | Target Description | Status |
| :--- | :--- | :--- | :--- |
{{ast:traceability_rows}}
<!-- odg:refs:end -->

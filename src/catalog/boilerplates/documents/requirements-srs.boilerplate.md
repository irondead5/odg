---
odg_id: requirements_srs
title: Software Requirements Specification (SRS)
category: document
scope: global_or_module
synced_commit: "{{ast:git_head}}"
---

# Software Requirements Specification (SRS) — {{ast:target_name}}

## 1. Actors, Roles & Access Guards
| Actor / Role | Auth Guard / Middleware | Permitted Scopes | Source Reference |
| :--- | :--- | :--- | :--- |
{{ast:actors_and_guards_rows_with_slots}}

## 2. Functional Requirements Catalog (`FR`)
| ID | Requirement Title | Business Rule & Trigger | Validation Schema (Zod/Pydantic/DTO) | Code Evidence |
| :--- | :--- | :--- | :--- | :--- |
{{ast:functional_requirements_rows_with_slots}}

## 3. Core Business Invariants & Edge Cases
{{slot:business_invariants_list}}

## 4. Non-Functional Requirements (`NFR`)
- **Security & Auth:** {{slot:nfr_security}}
- **Data Integrity & Transactions:** {{slot:nfr_data_integrity}}
- **Error Handling & Resilience:** {{slot:nfr_resilience}}

<!-- odg:refs:start -->
## 5. Cross-References & Traceability Matrix
| Requirement ID | Linked API Endpoint | Linked ERD Table | Sequence Flow | Status |
| :--- | :--- | :--- | :--- | :--- |
{{ast:traceability_rows}}
<!-- odg:refs:end -->

---
odg_id: technical_sow
title: Technical Scope of Work (SOW)
category: document
scope: global
synced_commit: "{{ast:git_head}}"
coverage_status: "{{ast:status}}"
---

# Technical Scope of Work (SOW) — {{ast:project_name}}

## 1. Executive Summary & System Purpose
{{slot:executive_summary}}

## 2. System Boundaries & Architecture Scope
{{slot:system_boundaries}}

### 2.1 Technology Stack & Runtime Matrix (AST Verified)
| Layer | Detected Packages / Frameworks | Version | Entrypoints |
| :--- | :--- | :--- | :--- |
{{ast:tech_stack_table_rows}}

## 3. Implemented Capabilities by Domain Module
| Domain Module | Path | Files | Key Capabilities & Deliverables | Status |
| :--- | :--- | :--- | :--- | :--- |
{{ast:module_capabilities_rows_with_slots}}

## 4. External Integrations & Third-Party SDKs
| Integration / SDK | Used In Module | Purpose & Data Exchanged | Auth Mechanism |
| :--- | :--- | :--- | :--- |
{{ast:external_integrations_rows_with_slots}}

## 5. Non-Functional Constraints, Assumptions & Out-of-Scope
### 5.1 Operational Constraints & SLAs
{{slot:operational_constraints}}

### 5.2 Detected Architectural Limitations / Out-of-Scope
{{slot:out_of_scope_boundaries}}

<!-- odg:refs:start -->
## 6. Cross-References & Traceability Matrix
| Source Section | Target Canonical ID | Target Description | Status |
| :--- | :--- | :--- | :--- |
{{ast:traceability_rows}}
<!-- odg:refs:end -->

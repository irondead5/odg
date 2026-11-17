---
odg_id: security_matrix
title: Security & Threat Matrix (STRIDE)
category: document
scope: global
synced_commit: "{{ast:git_head}}"
---

# Security & Threat Matrix (STRIDE)

## 1. Attack Surface Overview
{{slot:security_overview}}

## 2. Unguarded Endpoints & Missing Middlewares
| Method | Route | Expected Auth Guard | Detected State | Risk Level |
| :--- | :--- | :--- | :--- | :--- |
{{ast:unguarded_endpoints_table_rows}}

## 3. PII & Sensitive Data Flows
| Entity / Field | Detected Storage | Encryption / Hash | Exposure Risk |
| :--- | :--- | :--- | :--- |
{{ast:pii_fields_table_rows}}

## 4. Threat Mitigation Recommendations
{{slot:mitigation_plan}}

<!-- odg:refs:start -->
## 5. Cross-References
| Finding ID | Impacted Module | Linked Requirement | Status |
| :--- | :--- | :--- | :--- |
{{ast:traceability_rows}}
<!-- odg:refs:end -->

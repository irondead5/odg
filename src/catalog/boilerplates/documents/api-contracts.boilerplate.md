---
odg_id: api_contracts
title: API & Contract Catalog
category: document
scope: module_or_global
synced_commit: "{{ast:git_head}}"
---

# API & Contract Catalog — {{ast:target_name}}

## 1. Endpoints Overview
| Method | Route Path | Controller / Handler | Auth Guard | Description |
| :--- | :--- | :--- | :--- | :--- |
{{ast:api_endpoints_table_rows}}

## 2. Request & Response Schemas
{{ast:api_schemas_and_dtos_block}}

## 3. Error Handling & HTTP Status Codes
| HTTP Status | Error Code | Trigger Condition | Schema |
| :--- | :--- | :--- | :--- |
{{ast:error_status_table_rows}}

<!-- odg:refs:start -->
## 4. Cross-References
| Route | Implemented In | Associated Requirement | Status |
| :--- | :--- | :--- | :--- |
{{ast:traceability_rows}}
<!-- odg:refs:end -->

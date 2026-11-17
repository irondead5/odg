---
odg_id: env_runbook
title: Operational Runbook & Environment
category: document
scope: global
synced_commit: "{{ast:git_head}}"
---

# Operational Runbook & Environment Variables

## 1. Environment Variables Catalog
| Variable Name | Required | Default Value | Detected Source | Description & Impact |
| :--- | :--- | :--- | :--- | :--- |
{{ast:env_variables_table_rows}}

## 2. Secrets & External Credentials
{{slot:secrets_management_guide}}

## 3. Local Startup & Healthcheck Runbook
1. **Prerequisites:** {{slot:prerequisites_list}}
2. **Setup Commands:**
   ```bash
   {{ast:setup_commands}}
   ```
3. **Healthcheck Endpoint:** {{ast:healthcheck_endpoint}}

<!-- odg:refs:start -->
## 4. Cross-References
| Variable | Consumed In Module | Status |
| :--- | :--- | :--- |
{{ast:traceability_rows}}
<!-- odg:refs:end -->

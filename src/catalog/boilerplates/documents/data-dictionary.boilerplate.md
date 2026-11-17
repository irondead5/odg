---
odg_id: data_dictionary
title: Database & Data Dictionary
category: document
scope: global_or_module
synced_commit: "{{ast:git_head}}"
---

# Database & Data Dictionary — {{ast:target_name}}

## 1. Schema & Migration Summary
{{slot:data_model_overview}}

## 2. Tables & Column Specifications
{{ast:tables_detailed_data_dictionary}}

## 3. Database Indexes & Constraints
| Table | Index Name | Type / Columns | Unique | Purpose |
| :--- | :--- | :--- | :--- | :--- |
{{ast:database_indexes_table_rows}}

<!-- odg:refs:start -->
## 4. Cross-References
| Table | Referenced By Module | Linked Requirement | Status |
| :--- | :--- | :--- | :--- |
{{ast:traceability_rows}}
<!-- odg:refs:end -->

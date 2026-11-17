---
odg_id: tech_debt_audit
title: Technical Debt & Complexity Audit
category: document
scope: global
synced_commit: "{{ast:git_head}}"
---

# Technical Debt & Complexity Audit

## 1. Complexity & Hotspots Summary
{{ast:complexity_summary_metrics}}

## 2. High Cyclomatic Complexity Functions
| Function / Method | File:Line | Cyclomatic Complexity | Risk Level |
| :--- | :--- | :--- | :--- |
{{ast:high_complexity_table_rows}}

## 3. Circular Dependencies & Coupling
{{ast:circular_dependencies_report}}

## 4. Remediation Plan
{{slot:remediation_recommendations}}

<!-- odg:refs:start -->
## 5. Cross-References
| Hotspot Symbol | Owner Module | Linked ADR | Status |
| :--- | :--- | :--- | :--- |
{{ast:traceability_rows}}
<!-- odg:refs:end -->

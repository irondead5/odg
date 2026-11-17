---
odg_id: infra_topology
title: Deployment & Infrastructure Topology
category: diagram
diagram_type: infraTopology
synced_commit: "{{ast:git_head}}"
---

# Deployment & Infrastructure Topology — {{ast:project_name}}

## 1. Infrastructure Overview
{{slot:infra_overview}}

## 2. Interactive Topology Diagram
```mermaid
graph TB
{{ast:compiled_mermaid_infra_topology}}
```

## 3. Deployed Resources & Network Mapping
| Component | Host / Cloud Provider | Exposed Port | Ingress / Gateway | Environment |
| :--- | :--- | :--- | :--- | :--- |
{{ast:infra_resources_table_rows}}

<!-- odg:refs:start -->
## 4. Cross-References
| Resource | Consumed By Container | Status |
| :--- | :--- | :--- |
{{ast:traceability_rows}}
<!-- odg:refs:end -->

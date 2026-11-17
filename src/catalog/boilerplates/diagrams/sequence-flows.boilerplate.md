---
odg_id: sequence_flows
title: Sequence Diagram
category: diagram
diagram_type: sequenceDiagram
synced_commit: "{{ast:git_head}}"
---

# Critical Sequence Flows — {{ast:target_name}}

## 1. Flow Scenario Description
{{slot:sequence_scenario_description}}

## 2. Interactive Sequence Diagram
```mermaid
sequenceDiagram
{{ast:compiled_mermaid_sequence}}
```

## 3. Step-by-Step Call Trace
| Step | Source Actor / Service | Target Service / DB | Method / Payload | Error Handler |
| :--- | :--- | :--- | :--- | :--- |
{{ast:sequence_steps_table_rows}}

<!-- odg:refs:start -->
## 4. Cross-References
| Flow Name | Trigger Endpoint | Impacted Entities | Status |
| :--- | :--- | :--- | :--- |
{{ast:traceability_rows}}
<!-- odg:refs:end -->

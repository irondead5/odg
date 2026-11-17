---
odg_id: state_machines
title: State Machine Diagram
category: diagram
diagram_type: stateDiagram
synced_commit: "{{ast:git_head}}"
---

# State Machine & Lifecycle Transitions — {{ast:target_name}}

## 1. Lifecycle Overview
{{slot:state_lifecycle_overview}}

## 2. Interactive State Diagram
```mermaid
stateDiagram-v2
{{ast:compiled_mermaid_state_machine}}
```

## 3. Transition Rules & Invariants Matrix
| From State | To State | Trigger / Event | Guard Condition | Side Effects |
| :--- | :--- | :--- | :--- | :--- |
{{ast:state_transitions_table_rows}}

<!-- odg:refs:start -->
## 4. Cross-References
| Entity | Associated Requirement | Status |
| :--- | :--- | :--- |
{{ast:traceability_rows}}
<!-- odg:refs:end -->

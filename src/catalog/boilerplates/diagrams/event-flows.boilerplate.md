---
odg_id: event_flows
title: Event-Driven & Data Lineage Diagram
category: diagram
diagram_type: eventFlow
synced_commit: "{{ast:git_head}}"
---

# Event-Driven Architecture & Data Lineage — {{ast:target_name}}

## 1. Event Architecture Overview
{{slot:event_architecture_overview}}

## 2. Interactive Event Flow Diagram
```mermaid
graph LR
{{ast:compiled_mermaid_event_flows}}
```

## 3. Topics, Queues & Consumers Matrix
| Event / Topic Name | Publisher Service | Queue / Broker | Consumers / Handlers | Payload Schema |
| :--- | :--- | :--- | :--- | :--- |
{{ast:event_channels_table_rows}}

<!-- odg:refs:start -->
## 4. Cross-References
| Event | Triggering Module | Consuming Modules | Status |
| :--- | :--- | :--- | :--- |
{{ast:traceability_rows}}
<!-- odg:refs:end -->

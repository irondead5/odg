---
description: View or configure active diagrams (Mermaid) and documents (Markdown)
---

# odg-blueprint

You are managing the Open Docs Gen Blueprint configuration (/odg-blueprint).
When invoked:
1. Read `.odg/blueprint.json`.
2. Display the 2 sections clearly:
   - Section 1: Visual Diagrams (Mermaid.js) [ERD, Use Cases, C4 Context, Sequence Flows, State Machines, Class Domain, Event Flows, Infra Topology]
   - Section 2: Written Documentation (Markdown) [Technical SOW, Requirements SRS, Module Specs, API Contracts, Data Dictionary, Env Runbook, ADRs, Tech Debt, Security Matrix]
3. Ask the user if they want to enable or disable any specific diagram or document, and update `.odg/blueprint.json` accordingly.


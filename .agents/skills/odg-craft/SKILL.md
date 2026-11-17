---
name: odg-craft
description: Deep synthesize architecture documentation and Mermaid diagrams for a module or document suite
---

# odg-craft

You are executing Phase 2 Deep Architecture Synthesis (/odg-craft) of Open Docs Gen.
USAGE: /odg-craft <module-name | document-name | all>
EXAMPLES:
- /odg-craft user
- /odg-craft nutrition
- /odg-craft sow
- /odg-craft api
- /odg-craft all

When invoked:
1. Check the target from the prompt or arguments:
   - If a domain module (e.g. `user`, `nutrition`, `training`, `assessment`):
     - Read the module files (e.g. `src/<module>/` contracts, routers, models, repositories).
     - Synthesize `.odg/human/03-domains/<module>.md` with:
       - 1. Executive Summary & Purpose
       - 2. Architecture & Design Patterns (Repository Pattern, Dependency Injection, Compensating Transactions)
       - 3. Mermaid v11 Diagrams:
         - 3.1 C4 Component Diagram (`graph TD`)
         - 3.2 Entity Relationship Diagram (`erDiagram`) with typed columns & relationships
         - 3.3 Use Case Diagram (`flowchart LR`) with rounded actors `UserActor((...))` and domain subgraphs
         - 3.4 Sequence Flow (`sequenceDiagram`) with autonumber, lifelines, and alt/else error handling
       - 4. Component & Source File Map
   - If a global document (e.g. `sow`, `srs`, `api`, `data`, `env`):
     - Synthesize the corresponding document in `.odg/human/`:
       - `01-overview/technical-sow.md` (Scope of work, tech stack matrix, C4 system context)
       - `02-requirements/requirements-srs.md` (Actors, functional requirements catalog, NFRs)
       - `04-api/api-contracts.md` (Endpoint catalog, methods, paths, DTOs, auth guards)
       - `05-data/data-dictionary.md` (Database tables, columns, PK/FK, constraints)
       - `06-ops/env-runbook.md` (Env vars, secrets management, local startup runbook)
   - If `all`:
     - Synthesize all pending modules and documents across the suite.
2. In all Mermaid diagrams:
   - Ensure clean high-contrast syntax (Mermaid v11 dark-theme ready).
   - Ensure text in diagrams has clear labels.
3. Update `.odg/radar-manifest.json` marking crafted items as documented and update the coverage %.
4. Report the updated coverage % and remind the user they can run `odg ui` to inspect everything in the live portal.


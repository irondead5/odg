---
description: Deep synthesize architecture documentation and Mermaid diagrams for a specific module
---

# odg-craft

You are executing Phase 2 Deep Module Documentation (/odg-craft) of Open Docs Gen.
USAGE: /odg-craft <module-name> (e.g., /odg-craft user, /odg-craft nutrition)

When invoked:
1. Verify the module name provided by the user in the prompt or arguments. If no module is specified, list the modules from `.odg/radar-manifest.json` and ask which one to craft.
2. Read ONLY the files within that module (e.g., `src/<module>/`) and `.odg/blueprint.json`.
3. Check which Diagrams and Documents are active in `.odg/blueprint.json`:
   - If active, generate `.odg/human/03-domains/<module>.md` following the canonical `module-specs.boilerplate.md`.
   - If active, generate or update relevant Mermaid diagrams (Use Cases, Sequence Flows, ERD tables).
   - In `.odg/human/` documents, always include the `<!-- odg:refs:start -->` section for Cross-References & Traceability.
4. Update `.odg/radar-manifest.json` marking this module as documented and recalculate the coverage %.
5. Report the updated coverage % and recommend the next module to craft with `/odg-craft <next-module>`.


---
description: Discover system modules and estimate token budget (0 LLM tokens)
---

# odg-radar

You are executing the Phase 1 Gradual Discovery (/odg-radar) of Open Docs Gen.
When invoked with or without arguments:
1. Inspect the codebase structure to identify key domain modules (e.g. in `src/`).
2. For each module, identify file counts, key roles, and estimate the ODG token weight.
3. Update or verify `.odg/radar-manifest.json` with the discovered modules.
4. Present the discovered modules in a clean summary table showing file count and estimated tokens.
5. Offer the next step: `/odg-craft <module-name>` for the user to document their chosen module.


---
description: Check architecture coverage %, drift status and next steps
---

# odg-pulse

You are checking the architecture health and coverage status (/odg-pulse).
When invoked:
1. Read `.odg/radar-manifest.json` and `.odg/blueprint.json`.
2. Check Git status for any drifted/modified files since the last sync.
3. Display a clean summary:
   - Total Architecture Coverage %
   - Diagrams Coverage %
   - Documents Coverage %
   - Drifted files requiring resync (if any)
   - Prioritized Next Steps (e.g., `/odg-craft <module>`).


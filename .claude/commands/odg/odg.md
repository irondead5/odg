---
description: Open Docs Gen (odg) Command Center
---

# Open Docs Gen (`odg`) Command Center

When invoked, the agent must check `.odg/blueprint.json` and `.odg/radar-manifest.json`.
- If `.odg/` is missing, recommend running `odg init` or execute the setup wizard.
- Report current documentation coverage % (Diagrams % + Docs %).
- Present Next Steps to craft pending modules using `odg craft <module>`.
- Ensure generated diagrams use validated Mermaid v11 syntax.

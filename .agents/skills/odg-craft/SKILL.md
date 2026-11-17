---
name: odg-craft
description: Deep synthesize architecture documentation and Mermaid diagrams for a specific module (e.g. /odg-craft user, /odg-craft nutrition)
---

# ODG Craft Skill

Execute Phase 2 Deep Module Documentation for the specified module.
Usage: \`/odg-craft <module-name>\`

Steps:
1. Identify the module from user prompt (or ask if missing).
2. Inspect only \`src/<module>/\` and \`.odg/blueprint.json\`.
3. Synthesize \`.odg/human/03-domains/<module>.md\` using canonical boilerplates.
4. Update coverage in \`.odg/radar-manifest.json\`.

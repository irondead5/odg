---
name: odg-sweep
description: Reconcile cross-document references and update traceability links
---

# odg-sweep

You are running the Referential Knowledge Base Link-Sweep (/odg-sweep).
When invoked:
1. Inspect all generated Markdown documents in `.odg/human/`.
2. Scan for canonical entity IDs (`[[mod:...]]`, `[[tbl:...]]`, `[[req:...]]`, `[[api:...]]`).
3. Reconcile forward links and backlinks in the `<!-- odg:refs:start -->` section of each file.
4. Upgrade any references that pointed to pending modules to point to the freshly generated specs.


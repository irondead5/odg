# 🤖 AI Assistant & Multi-CLI Integrations

Open Docs Gen (`odg`) is designed from the ground up for agentic workflows. Rather than treating documentation as an afterthought, `odg` installs native slash commands, skills, and prompts directly into your AI coding tools and IDEs.

---

## Supported AI Tools & CLIs

| Tool / CLI | Integration Mechanism | Generated Paths |
| :--- | :--- | :--- |
| **Google Antigravity (`agy` CLI & IDE)** | Native Skills & Workflows | `.agents/skills/odg*/SKILL.md`, `.agents/workflows/odg-*.md`, `AGENTS.md` |
| **Claude Code (`claude`)** | Custom Commands & Tools | `.claude/commands/odg/*.md`, `CLAUDE.md` |
| **GitHub Copilot (`github-copilot`)** | Reusable Prompts & Agent Rules | `.github/prompts/odg-*.prompt.md`, `.github/copilot-instructions.md` |
| **OpenAI Codex CLI (`codex`)** | System Prompts & Instructions | `.codex/prompts/odg-*.md`, `AGENTS.md` |
| **Cursor (`cursor`)** | Rule Documents & MDC | `.cursor/rules/odg.mdc`, `.cursor/commands/odg-*.md` |
| **Windsurf (`windsurf`)** | Workflows & Rules | `.windsurf/workflows/odg-*.md`, `.windsurfrules` |
| **OpenCode (`opencode`)** | Commands & Skills | `.opencode/command/odg-*.md`, `.opencode/skill/odg/SKILL.md` |

---

## Native Slash Commands

When you initialize `odg` with your chosen tools, the following slash commands become immediately accessible inside your AI terminal chats and prompts:

### `/odg`
**Command Center & Architecture Dashboard**
* Inspects `.odg/blueprint.json` and `.odg/radar-manifest.json`.
* Reports current architecture coverage % and highlights recommended next actions.
* Lists all discovered modules without token-dumping the codebase.

### `/odg-radar`
**Zero-Token Module Discovery**
* Scans the codebase structure (`src/`) deterministically (0 LLM tokens).
* Calculates lines of code and estimated token weights.
* Auto-scaffolds missing document stubs in `.odg/human/`.
* Displays a formatted table with discovered domains.

### `/odg-craft <target>`
**Deep Architecture Synthesis Engine**
* **Module Targets:** `/odg-craft user`, `/odg-craft nutrition`, `/odg-craft training`
  * Reads only the relevant files in `src/<module>/`.
  * Generates C4 component, ERD, Use Cases, and Sequence diagrams in Mermaid v11.
  * Writes `.odg/human/03-domains/<module>.md`.
* **Global Document Targets:** `/odg-craft sow`, `/odg-craft srs`, `/odg-craft api`, `/odg-craft data`, `/odg-craft env`
  * Synthesizes global SOW, Requirements, API contracts, or Runbooks.
* **Batch Target:** `/odg-craft all`
  * Sequentially documents all pending modules and global specifications.

### `/odg-blueprint`
**Interactive Blueprint Configurator**
* View and toggle active Mermaid diagrams (Section 1) and written Markdown documents (Section 2).
* Updates `.odg/blueprint.json` in place.

### `/odg-pulse`
**Healthcheck & Drift Audit**
* Checks current coverage percentages (Total %, Diagrams %, Documents %).
* Detects modified/drifted files requiring documentation resync.

### `/odg-sweep`
**Referential Link Reconciler**
* Reconciles cross-document references, backlinks, and traceability matrices across `.odg/human/`.

---

## How AI Skill Discovery Works

In tools like **Google Antigravity CLI (`agy`)**:
* Autocomplete works via prefix matching:
  * Typing `/odg` highlights the primary command center.
  * Typing `/odg-` immediately displays all direct sub-commands (`/odg-craft`, `/odg-radar`, `/odg-blueprint`, `/odg-pulse`, `/odg-sweep`).
  * You can also use arrow keys `↓` / `↑` at `/odg` to cycle through the full command suite.
* Skills use **progressive disclosure**: only names and concise triggers are loaded into context, preserving your conversation token window until a command is actively triggered.

---

## Re-synchronizing Integrations (`odg update`)

If you install a new AI CLI or modify `.odg/blueprint.json`, update all integrations across your workspace with:

```bash
odg update
```
This regenerates and verifies all skill definitions in your local workspace and global machine profiles.

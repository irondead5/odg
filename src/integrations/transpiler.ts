import fs from 'node:fs/promises';
import path from 'node:path';
import type { AiToolId } from '../catalog/types.js';
import { SUPPORTED_AI_TOOLS } from './adapters.js';

export interface WorkflowCommandDef {
  name: string;
  filename: string;
  description: string;
  prompt: string;
}

export const ODG_WORKFLOW_COMMANDS: WorkflowCommandDef[] = [
  {
    name: 'odg',
    filename: 'odg',
    description: 'Open Docs Gen (odg) Command Center & Architecture Dashboard',
    prompt: `You are acting as the Open Docs Gen (odg) Architecture Documentation Engine.
When invoked:
1. Check \`.odg/blueprint.json\` and \`.odg/radar-manifest.json\`.
2. Report the current coverage % (Total %, Diagrams %, Documents %) and active Next Steps.
3. Present the list of discovered modules and offer clear slash commands:
   - \`/odg-radar\` to scan or refresh changed files (0 LLM tokens)
   - \`/odg-craft <module>\` to generate documentation for a specific module
   - \`/odg-blueprint\` to toggle diagrams or documents
   - \`/odg-pulse\` to check drift and health
4. NEVER dump the entire codebase into the prompt; guide the user module-by-module to preserve token budget.
`
  },
  {
    name: 'odg-radar',
    filename: 'odg-radar',
    description: 'Discover system modules and estimate token budget (0 LLM tokens)',
    prompt: `You are executing the Phase 1 Gradual Discovery (/odg-radar) of Open Docs Gen.
When invoked with or without arguments:
1. Inspect the codebase structure to identify key domain modules (e.g. in \`src/\`).
2. For each module, identify file counts, key roles, and estimate the ODG token weight.
3. Update or verify \`.odg/radar-manifest.json\` with the discovered modules.
4. Present the discovered modules in a clean summary table showing file count and estimated tokens.
5. Offer the next step: \`/odg-craft <module-name>\` for the user to document their chosen module.
`
  },
  {
    name: 'odg-craft',
    filename: 'odg-craft',
    description: 'Deep synthesize architecture documentation and Mermaid diagrams for a specific module',
    prompt: `You are executing Phase 2 Deep Module Documentation (/odg-craft) of Open Docs Gen.
USAGE: /odg-craft <module-name> (e.g., /odg-craft user, /odg-craft nutrition)

When invoked:
1. Verify the module name provided by the user in the prompt or arguments. If no module is specified, list the modules from \`.odg/radar-manifest.json\` and ask which one to craft.
2. Read ONLY the files within that module (e.g., \`src/<module>/\`) and \`.odg/blueprint.json\`.
3. Check which Diagrams and Documents are active in \`.odg/blueprint.json\`:
   - If active, generate \`.odg/human/03-domains/<module>.md\` following the canonical \`module-specs.boilerplate.md\`.
   - If active, generate or update relevant Mermaid diagrams (Use Cases, Sequence Flows, ERD tables).
   - In \`.odg/human/\` documents, always include the \`<!-- odg:refs:start -->\` section for Cross-References & Traceability.
4. Update \`.odg/radar-manifest.json\` marking this module as documented and recalculate the coverage %.
5. Report the updated coverage % and recommend the next module to craft with \`/odg-craft <next-module>\`.
`
  },
  {
    name: 'odg-blueprint',
    filename: 'odg-blueprint',
    description: 'View or configure active diagrams (Mermaid) and documents (Markdown)',
    prompt: `You are managing the Open Docs Gen Blueprint configuration (/odg-blueprint).
When invoked:
1. Read \`.odg/blueprint.json\`.
2. Display the 2 sections clearly:
   - Section 1: Visual Diagrams (Mermaid.js) [ERD, Use Cases, C4 Context, Sequence Flows, State Machines, Class Domain, Event Flows, Infra Topology]
   - Section 2: Written Documentation (Markdown) [Technical SOW, Requirements SRS, Module Specs, API Contracts, Data Dictionary, Env Runbook, ADRs, Tech Debt, Security Matrix]
3. Ask the user if they want to enable or disable any specific diagram or document, and update \`.odg/blueprint.json\` accordingly.
`
  },
  {
    name: 'odg-pulse',
    filename: 'odg-pulse',
    description: 'Check architecture coverage %, drift status and next steps',
    prompt: `You are checking the architecture health and coverage status (/odg-pulse).
When invoked:
1. Read \`.odg/radar-manifest.json\` and \`.odg/blueprint.json\`.
2. Check Git status for any drifted/modified files since the last sync.
3. Display a clean summary:
   - Total Architecture Coverage %
   - Diagrams Coverage %
   - Documents Coverage %
   - Drifted files requiring resync (if any)
   - Prioritized Next Steps (e.g., \`/odg-craft <module>\`).
`
  },
  {
    name: 'odg-sweep',
    filename: 'odg-sweep',
    description: 'Reconcile cross-document references and update traceability links',
    prompt: `You are running the Referential Knowledge Base Link-Sweep (/odg-sweep).
When invoked:
1. Inspect all generated Markdown documents in \`.odg/human/\`.
2. Scan for canonical entity IDs (\`[[mod:...]]\`, \`[[tbl:...]]\`, \`[[req:...]]\`, \`[[api:...]]\`).
3. Reconcile forward links and backlinks in the \`<!-- odg:refs:start -->\` section of each file.
4. Upgrade any references that pointed to pending modules to point to the freshly generated specs.
`
  }
];

export async function installToolIntegrations(
  targetTools: AiToolId[],
  rootDir: string = process.cwd()
): Promise<string[]> {
  const installedPaths: string[] = [];

  for (const toolId of targetTools) {
    const adapter = SUPPORTED_AI_TOOLS[toolId];
    if (!adapter) continue;

    const fullCommandDir = path.join(rootDir, adapter.commandDir);
    await fs.mkdir(fullCommandDir, { recursive: true });

    // Generate each specific slash command workflow
    for (const cmd of ODG_WORKFLOW_COMMANDS) {
      let ext = '.md';
      if (adapter.commandPattern === 'prompt_md') ext = '.prompt.md';
      if (adapter.commandPattern === 'toml') ext = '.toml';

      const cmdFilePath = path.join(fullCommandDir, `${cmd.filename}${ext}`);
      const content = formatCommandForAdapter(adapter, cmd);
      await fs.writeFile(cmdFilePath, content, 'utf-8');
      installedPaths.push(cmdFilePath);
    }

    // Generate Skill if tool supports it
    if (adapter.skillsDir) {
      const fullSkillDir = path.join(rootDir, adapter.skillsDir);
      await fs.mkdir(fullSkillDir, { recursive: true });
      const skillPath = path.join(fullSkillDir, 'SKILL.md');
      await fs.writeFile(skillPath, generateSkillContent(), 'utf-8');
      installedPaths.push(skillPath);
    }
  }

  return installedPaths;
}

function formatCommandForAdapter(
  adapter: (typeof SUPPORTED_AI_TOOLS)[AiToolId],
  cmd: WorkflowCommandDef
): string {
  if (adapter.commandPattern === 'toml') {
    return `description = "${cmd.description}"
prompt = """
${cmd.prompt}
"""
`;
  }

  return `---
description: ${cmd.description}
---

# ${cmd.name}

${cmd.prompt}
`;
}

function generateSkillContent(): string {
  return `---
name: odg
description: Expert software architecture documentation generator powered by Open Docs Gen (odg)
---

# ODG Architecture Documentation Skill

Use this skill when analyzing, generating, or syncing architecture specifications, diagrams (ERD, C4, Sequence), and technical SOWs with \`odg\`.
Available slash commands:
- \`/odg\`: Command Center & overview
- \`/odg-radar\`: Discover modules & token budgets (0 tokens)
- \`/odg-craft <module>\`: Deeply document a specific module
- \`/odg-blueprint\`: Configure diagrams and documents
- \`/odg-pulse\`: Check coverage % and drift
- \`/odg-sweep\`: Reconcile cross-document references & backlinks
Always respect the active \`.odg/blueprint.json\` configuration.
`;
}

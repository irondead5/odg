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
3. Auto-scaffold any missing enabled documents from \`.odg/blueprint.json\` into \`.odg/human/\` (Technical SOW, Requirements SRS, API Contracts, Data Dictionary, Env Runbook).
4. Update or verify \`.odg/radar-manifest.json\` with the discovered modules and coverage %.
5. Present the discovered modules in a clean summary table showing file count, estimated tokens, and status.
6. Offer the next step: \`/odg-craft <module-name>\` or \`odg ui\` to inspect the architecture suite.
`
  },
  {
    name: 'odg-craft',
    filename: 'odg-craft',
    description: 'Deep synthesize architecture documentation and Mermaid diagrams for a module or document suite',
    prompt: `You are executing Phase 2 Deep Architecture Synthesis (/odg-craft) of Open Docs Gen.
USAGE: /odg-craft <module-name | document-name | all>
EXAMPLES:
- /odg-craft user
- /odg-craft nutrition
- /odg-craft sow
- /odg-craft api
- /odg-craft all

When invoked:
1. Check the target from the prompt or arguments:
   - If a domain module (e.g. \`user\`, \`nutrition\`, \`training\`, \`assessment\`):
     - Read the module files (e.g. \`src/<module>/\` contracts, routers, models, repositories).
     - Synthesize \`.odg/human/03-domains/<module>.md\` with:
       - 1. Executive Summary & Purpose
       - 2. Architecture & Design Patterns (Repository Pattern, Dependency Injection, Compensating Transactions)
       - 3. Mermaid v11 Diagrams:
         - 3.1 C4 Component Diagram (\`graph TD\`)
         - 3.2 Entity Relationship Diagram (\`erDiagram\`) with typed columns & relationships
         - 3.3 Use Case Diagram (\`flowchart LR\`) with rounded actors \`UserActor((...))\` and domain subgraphs
         - 3.4 Sequence Flow (\`sequenceDiagram\`) with autonumber, lifelines, and alt/else error handling
       - 4. Component & Source File Map
   - If a global document (e.g. \`sow\`, \`srs\`, \`api\`, \`data\`, \`env\`):
     - Synthesize the corresponding document in \`.odg/human/\`:
       - \`01-overview/technical-sow.md\` (Scope of work, tech stack matrix, C4 system context)
       - \`02-requirements/requirements-srs.md\` (Actors, functional requirements catalog, NFRs)
       - \`04-api/api-contracts.md\` (Endpoint catalog, methods, paths, DTOs, auth guards)
       - \`05-data/data-dictionary.md\` (Database tables, columns, PK/FK, constraints)
       - \`06-ops/env-runbook.md\` (Env vars, secrets management, local startup runbook)
   - If \`all\`:
     - Synthesize all pending modules and documents across the suite.
2. In all Mermaid diagrams:
   - Ensure clean high-contrast syntax (Mermaid v11 dark-theme ready).
   - Ensure text in diagrams has clear labels.
3. Update \`.odg/radar-manifest.json\` marking crafted items as documented and update the coverage %.
4. Report the updated coverage % and remind the user they can run \`odg ui\` to inspect everything in the live portal.
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

      // In Antigravity, slash commands are also populated from .agents/skills/<cmd>/SKILL.md
      if (toolId === 'agy') {
        const skillDir = path.join(rootDir, '.agents/skills', cmd.filename);
        await fs.mkdir(skillDir, { recursive: true });
        const skillFilePath = path.join(skillDir, 'SKILL.md');
        const skillContent = `---
name: ${cmd.filename}
description: ${cmd.description}
---

# ${cmd.name}

${cmd.prompt}
`;
        await fs.writeFile(skillFilePath, skillContent, 'utf-8');
        installedPaths.push(skillFilePath);
      }
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

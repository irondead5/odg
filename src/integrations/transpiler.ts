import fs from 'node:fs/promises';
import path from 'node:path';
import type { AiToolId } from '../catalog/types.js';
import { SUPPORTED_AI_TOOLS } from './adapters.js';

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

    // Generate primary /odg command
    let cmdFileName = 'odg.md';
    if (adapter.commandPattern === 'workflow') cmdFileName = 'odg.md';
    if (adapter.commandPattern === 'prompt_md') cmdFileName = 'odg.prompt.md';
    if (adapter.commandPattern === 'toml') cmdFileName = 'odg.toml';

    const cmdFilePath = path.join(fullCommandDir, cmdFileName);
    const content = generateCommandContent(toolId, adapter);
    await fs.writeFile(cmdFilePath, content, 'utf-8');
    installedPaths.push(cmdFilePath);

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

function generateCommandContent(toolId: AiToolId, adapter: (typeof SUPPORTED_AI_TOOLS)[AiToolId]): string {
  if (adapter.commandPattern === 'toml') {
    return `description = "Open Docs Gen (odg) interactive architecture documentation wizard"
prompt = """
You are acting as the Open Docs Gen (odg) documentation engine.
Read .odg/blueprint.json and .odg/radar-manifest.json.
Help the user discover modules and craft documentation towards 100% coverage.
"""
`;
  }

  return `---
description: Open Docs Gen (odg) Command Center
---

# Open Docs Gen (\`odg\`) Command Center

When invoked, the agent must check \`.odg/blueprint.json\` and \`.odg/radar-manifest.json\`.
- If \`.odg/\` is missing, recommend running \`odg init\` or execute the setup wizard.
- Report current documentation coverage % (Diagrams % + Docs %).
- Present Next Steps to craft pending modules using \`odg craft <module>\`.
- Ensure generated diagrams use validated Mermaid v11 syntax.
`;
}

function generateSkillContent(): string {
  return `---
name: odg
description: Expert software architecture documentation generator powered by Open Docs Gen (odg)
---

# ODG Architecture Documentation Skill

Use this skill when analyzing, generating, or syncing architecture specifications, diagrams (ERD, C4, Sequence), and technical SOWs with \`odg\`.
Always respect the active \`.odg/blueprint.json\` configuration.
`;
}

import type { AiToolId } from '../catalog/types.js';

export interface ToolAdapter {
  id: AiToolId;
  name: string;
  commandPattern: 'workflow' | 'command_md' | 'prompt_md' | 'toml' | 'rules_only';
  commandDir: string;
  rulesDir?: string;
  skillsDir?: string;
}

export const SUPPORTED_AI_TOOLS: Record<AiToolId, ToolAdapter> = {
  agy: {
    id: 'agy',
    name: 'Antigravity (agy CLI & IDE)',
    commandPattern: 'workflow',
    commandDir: '.agents/workflows',
    rulesDir: '.',
    skillsDir: '.agents/skills/odg'
  },
  claude: {
    id: 'claude',
    name: 'Claude Code (claude CLI)',
    commandPattern: 'command_md',
    commandDir: '.claude/commands/odg',
    rulesDir: '.',
    skillsDir: '.claude/skills/odg'
  },
  'github-copilot': {
    id: 'github-copilot',
    name: 'GitHub Copilot (CLI & IDE)',
    commandPattern: 'prompt_md',
    commandDir: '.github/prompts',
    rulesDir: '.github',
    skillsDir: '.github/skills/odg'
  },
  codex: {
    id: 'codex',
    name: 'OpenAI Codex CLI (codex)',
    commandPattern: 'prompt_md',
    commandDir: '.codex/prompts',
    rulesDir: '.',
    skillsDir: '.codex/skills/odg'
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini CLI (gemini)',
    commandPattern: 'toml',
    commandDir: '.gemini/commands/odg',
    rulesDir: '.',
    skillsDir: '.gemini/skills/odg'
  },
  cursor: {
    id: 'cursor',
    name: 'Cursor',
    commandPattern: 'command_md',
    commandDir: '.cursor/commands',
    rulesDir: '.cursor/rules'
  },
  windsurf: {
    id: 'windsurf',
    name: 'Windsurf',
    commandPattern: 'workflow',
    commandDir: '.windsurf/workflows',
    rulesDir: '.'
  },
  opencode: {
    id: 'opencode',
    name: 'OpenCode (opencode CLI)',
    commandPattern: 'command_md',
    commandDir: '.opencode/command',
    rulesDir: '.',
    skillsDir: '.opencode/skill/odg'
  },
  cline: {
    id: 'cline',
    name: 'Cline',
    commandPattern: 'workflow',
    commandDir: '.clinerules/workflows',
    rulesDir: '.clinerules'
  },
  roocode: {
    id: 'roocode',
    name: 'Roo Code',
    commandPattern: 'command_md',
    commandDir: '.roo/commands',
    rulesDir: '.roo/rules'
  },
  kilocode: {
    id: 'kilocode',
    name: 'Kilo Code (kilocode CLI)',
    commandPattern: 'workflow',
    commandDir: '.kilocode/workflows',
    rulesDir: '.kilocode/rules'
  },
  'amazon-q': {
    id: 'amazon-q',
    name: 'Amazon Q Developer',
    commandPattern: 'prompt_md',
    commandDir: '.amazonq/prompts',
    rulesDir: '.amazonq/rules'
  },
  augment: {
    id: 'augment',
    name: 'Augment Code (auggie CLI)',
    commandPattern: 'command_md',
    commandDir: '.augment/commands',
    rulesDir: '.augment/rules'
  },
  continue: {
    id: 'continue',
    name: 'Continue',
    commandPattern: 'prompt_md',
    commandDir: '.continue/prompts',
    rulesDir: '.continue/rules'
  },
  universal: {
    id: 'universal',
    name: 'Universal Agent (Aider / Zed / Trae)',
    commandPattern: 'workflow',
    commandDir: '.agents/workflows',
    rulesDir: '.'
  }
};

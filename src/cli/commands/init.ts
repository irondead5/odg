import { defineCommand } from 'citty';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  DIAGRAM_DEFINITIONS,
  DOCUMENT_DEFINITIONS,
  createDefaultBlueprint
} from '../../catalog/registry.js';
import type {
  DiagramId,
  DocumentId,
  AiToolId,
  SweepMode,
  LinkCategoryId,
  OdgBlueprintConfig
} from '../../catalog/types.js';
import { SUPPORTED_AI_TOOLS } from '../../integrations/adapters.js';
import { installToolIntegrations } from '../../integrations/transpiler.js';

export const initCommand = defineCommand({
  meta: {
    name: 'init',
    description: 'Interactive Onboarding Wizard for Open Docs Gen (odg)'
  },
  args: {
    preset: {
      type: 'string',
      description: 'Preset mode (recommended | enterprise | mvp | custom)'
    }
  },
  async run() {
    p.intro(pc.bgCyan(pc.black(' Open Docs Gen (odg) — Setup Wizard ')));

    // Step 1: Preset
    const presetChoice = (await p.select({
      message: 'Paso 1: Elige el preset de arquitectura para este proyecto:',
      options: [
        {
          value: 'recommended',
          label: '⚡ Recomendado Estándar',
          hint: 'ERD, Casos de Uso, C4, Secuencia + SOW, Requerimientos, APIs, Diccionario, Runbook'
        },
        {
          value: 'enterprise',
          label: '🏢 Full Enterprise',
          hint: 'Los 8 Diagramas + Los 9 Documentos (ADRs, Deuda Técnica, Seguridad)'
        },
        {
          value: 'mvp',
          label: '🚀 Lean / MVP',
          hint: 'C4, ERD + SOW Técnico, Specs por Módulo y Runbook'
        },
        {
          value: 'custom',
          label: '🎛️ Personalizado',
          hint: 'Marcar y desmarcar cada diagrama y documento manualmente'
        }
      ]
    })) as OdgBlueprintConfig['preset'];

    if (p.isCancel(presetChoice)) {
      p.cancel('Operación cancelada.');
      process.exit(0);
    }

    const config = createDefaultBlueprint(presetChoice);

    // Step 2 & 3: Custom selection if chosen
    if (presetChoice === 'custom') {
      const diagramOptions = Object.values(DIAGRAM_DEFINITIONS).map((d) => ({
        value: d.id,
        label: d.name,
        hint: d.description
      }));

      const selectedDiagrams = (await p.multiselect({
        message: 'Paso 2: Sección 1 — Diagramas Visuales (Mermaid.js):',
        options: diagramOptions,
        initialValues: ['erd', 'use_cases', 'c4_context', 'sequence_flows']
      })) as DiagramId[];

      if (p.isCancel(selectedDiagrams)) {
        p.cancel('Operación cancelada.');
        process.exit(0);
      }

      for (const key of Object.keys(config.diagrams) as DiagramId[]) {
        config.diagrams[key] = selectedDiagrams.includes(key);
      }

      const documentOptions = Object.values(DOCUMENT_DEFINITIONS).map((doc) => ({
        value: doc.id,
        label: doc.name,
        hint: doc.description
      }));

      const selectedDocs = (await p.multiselect({
        message: 'Paso 3: Sección 2 — Documentación Escrita (Markdown):',
        options: documentOptions,
        initialValues: [
          'technical_sow',
          'requirements_srs',
          'module_specs',
          'api_contracts',
          'data_dictionary',
          'env_runbook'
        ]
      })) as DocumentId[];

      if (p.isCancel(selectedDocs)) {
        p.cancel('Operación cancelada.');
        process.exit(0);
      }

      for (const key of Object.keys(config.documents) as DocumentId[]) {
        config.documents[key] = selectedDocs.includes(key);
      }
    }

    // Step 4: Knowledge Base & Sweep Mode
    const sweepMode = (await p.select({
      message: 'Paso 4: Modo de Barrido y Base de Conocimiento Referencial:',
      options: [
        {
          value: 'auto_zero_token',
          label: '⚡ Resolución Automática en 0 Tokens (Recomendado)',
          hint: 'Actualiza referencias y backlinks en milisegundos tras cada generación'
        },
        {
          value: 'manual_sweep',
          label: '🎯 Barrido Bajo Demanda (/odg-sweep)',
          hint: 'Mantiene stubs preliminares hasta ejecutar odg sweep manualmente'
        },
        {
          value: 'hybrid_ai_sweep',
          label: '🤖 Híbrido con Barrido Semántico al 100%',
          hint: '0 tokens automático y barrido semántico profundo al llegar a 100% coverage'
        }
      ]
    })) as SweepMode;

    if (p.isCancel(sweepMode)) {
      p.cancel('Operación cancelada.');
      process.exit(0);
    }
    config.knowledgeBase.sweepMode = sweepMode;

    // Step 5: AI Tools Selection
    const aiToolOptions = Object.values(SUPPORTED_AI_TOOLS).map((tool) => ({
      value: tool.id,
      label: tool.name
    }));

    const selectedAiTools = (await p.multiselect({
      message: 'Paso 5: Selecciona qué AI CLIs / IDEs usas en este proyecto:',
      options: aiToolOptions,
      initialValues: ['agy', 'claude', 'github-copilot']
    })) as AiToolId[];

    if (p.isCancel(selectedAiTools)) {
      p.cancel('Operación cancelada.');
      process.exit(0);
    }
    config.aiClis = selectedAiTools;

    // Save .odg/blueprint.json
    const odgDir = path.join(process.cwd(), '.odg');
    await fs.mkdir(odgDir, { recursive: true });
    await fs.writeFile(
      path.join(odgDir, 'blueprint.json'),
      JSON.stringify(config, null, 2),
      'utf-8'
    );

    // Auto-scaffold enabled documents in .odg/human/
    await autoScaffoldSuite(odgDir, config.documents);

    // Install AI CLI integrations
    const s = p.spinner();
    s.start('Instalando slash commands y skills en tus herramientas de IA...');
    const installed = await installToolIntegrations(selectedAiTools);
    s.stop(`Integraciones creadas en ${installed.length} archivos.`);

    p.note(
      `Configuración guardada en .odg/blueprint.json\n` +
        `Diagramas activos: ${Object.values(config.diagrams).filter(Boolean).length}\n` +
        `Documentos activos: ${Object.values(config.documents).filter(Boolean).length}`,
      '¡Inicialización Completa!'
    );

    p.outro(pc.green('Listo. Escribe /odg en tu CLI o ejecuta "odg radar" para escanear el proyecto.'));
  }
});

async function autoScaffoldSuite(odgDir: string, docsConfig: Record<string, boolean> = {}) {
  try {
    const scaffoldMap: Record<string, { relPath: string; title: string }> = {
      technical_sow: { relPath: '01-overview/technical-sow.md', title: 'Technical Scope of Work (SOW)' },
      requirements_srs: { relPath: '02-requirements/requirements-srs.md', title: 'Software Requirements Specification (SRS)' },
      api_contracts: { relPath: '04-api/api-contracts.md', title: 'API & Contract Catalog' },
      data_dictionary: { relPath: '05-data/data-dictionary.md', title: 'Database & Data Dictionary' },
      env_runbook: { relPath: '06-ops/env-runbook.md', title: 'Operational Runbook & Environment Matrix' }
    };

    for (const [key, item] of Object.entries(scaffoldMap)) {
      if (docsConfig[key]) {
        const fullPath = path.join(odgDir, 'human', item.relPath);
        try {
          await fs.access(fullPath);
        } catch {
          await fs.mkdir(path.dirname(fullPath), { recursive: true });
          await fs.writeFile(
            fullPath,
            `# ${item.title}\n\nDocumento activado en .odg/blueprint.json. Generado automáticamente por Open Docs Gen.\n`,
            'utf-8'
          );
        }
      }
    }
  } catch {}
}

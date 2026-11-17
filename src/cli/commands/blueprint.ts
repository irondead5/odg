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
import type { DiagramId, DocumentId, OdgBlueprintConfig } from '../../catalog/types.js';

export const blueprintCommand = defineCommand({
  meta: {
    name: 'blueprint',
    description: 'Configure and toggle Diagrams & Documents in .odg/blueprint.json'
  },
  async run() {
    p.intro(pc.bgMagenta(pc.black(' ODG Blueprint Settings ')));

    const blueprintPath = path.join(process.cwd(), '.odg', 'blueprint.json');
    let config: OdgBlueprintConfig;

    try {
      const content = await fs.readFile(blueprintPath, 'utf-8');
      config = JSON.parse(content);
    } catch {
      config = createDefaultBlueprint('recommended');
    }

    // Toggle Diagrams
    const diagramOptions = Object.values(DIAGRAM_DEFINITIONS).map((d) => ({
      value: d.id,
      label: d.name,
      hint: d.description
    }));

    const initialDiagrams = (Object.keys(config.diagrams) as DiagramId[]).filter(
      (k) => config.diagrams[k]
    );

    const selectedDiagrams = (await p.multiselect({
      message: 'Sección 1: Diagramas Visuales (Mermaid.js) — Marca [x] o desmarca [ ]:',
      options: diagramOptions,
      initialValues: initialDiagrams
    })) as DiagramId[];

    if (p.isCancel(selectedDiagrams)) {
      p.cancel('Operación cancelada.');
      process.exit(0);
    }

    for (const key of Object.keys(config.diagrams) as DiagramId[]) {
      config.diagrams[key] = selectedDiagrams.includes(key);
    }

    // Toggle Documents
    const documentOptions = Object.values(DOCUMENT_DEFINITIONS).map((doc) => ({
      value: doc.id,
      label: doc.name,
      hint: doc.description
    }));

    const initialDocs = (Object.keys(config.documents) as DocumentId[]).filter(
      (k) => config.documents[k]
    );

    const selectedDocs = (await p.multiselect({
      message: 'Sección 2: Documentación Escrita (Markdown) — Marca [x] o desmarca [ ]:',
      options: documentOptions,
      initialValues: initialDocs
    })) as DocumentId[];

    if (p.isCancel(selectedDocs)) {
      p.cancel('Operación cancelada.');
      process.exit(0);
    }

    for (const key of Object.keys(config.documents) as DocumentId[]) {
      config.documents[key] = selectedDocs.includes(key);
    }

    await fs.mkdir(path.dirname(blueprintPath), { recursive: true });
    await fs.writeFile(blueprintPath, JSON.stringify(config, null, 2), 'utf-8');

    p.outro(pc.green('Blueprint actualizado con éxito en .odg/blueprint.json'));
  }
});

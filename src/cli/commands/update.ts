import { defineCommand } from 'citty';
import pc from 'picocolors';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { OdgBlueprintConfig } from '../../catalog/types.js';
import { installToolIntegrations } from '../../integrations/transpiler.js';

export const updateCommand = defineCommand({
  meta: {
    name: 'update',
    description: 'Refresh and update installed AI CLI slash commands and skills'
  },
  async run() {
    const blueprintPath = path.join(process.cwd(), '.odg', 'blueprint.json');
    try {
      const content = await fs.readFile(blueprintPath, 'utf-8');
      const config: OdgBlueprintConfig = JSON.parse(content);
      const tools = config.aiClis || ['agy', 'claude'];
      const updated = await installToolIntegrations(tools);
      console.log(pc.green(`\n✅ Integraciones de IA actualizadas en ${updated.length} archivos.\n`));
    } catch {
      console.log(pc.yellow('\n⚠️  No se encontró .odg/blueprint.json. Ejecuta "odg init" primero.\n'));
    }
  }
});

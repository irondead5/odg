import { defineCommand } from 'citty';
import { initCommand } from './commands/init.js';
import { blueprintCommand } from './commands/blueprint.js';
import { pulseCommand } from './commands/pulse.js';
import { updateCommand } from './commands/update.js';

export const mainCommand = defineCommand({
  meta: {
    name: 'odg',
    version: '0.1.0',
    description: 'Open Docs Gen (odg) — Zero-thought Architecture Documentation Framework'
  },
  subCommands: {
    init: initCommand,
    blueprint: blueprintCommand,
    pulse: pulseCommand,
    update: updateCommand
  }
});

import { defineCommand } from 'citty';
import { initCommand } from './commands/init.js';
import { blueprintCommand } from './commands/blueprint.js';
import { pulseCommand } from './commands/pulse.js';
import { updateCommand } from './commands/update.js';
import { uiCommand } from './commands/ui.js';
import { radarCommand } from './commands/radar.js';
import { craftCommand } from './commands/craft.js';
import { sweepCommand } from './commands/sweep.js';

export const mainCommand = defineCommand({
  meta: {
    name: 'odg',
    version: '0.1.0',
    description: 'Open Docs Gen (odg) — Zero-thought Architecture Documentation Framework'
  },
  subCommands: {
    init: initCommand,
    blueprint: blueprintCommand,
    radar: radarCommand,
    craft: craftCommand,
    pulse: pulseCommand,
    sweep: sweepCommand,
    update: updateCommand,
    ui: uiCommand
  }
});

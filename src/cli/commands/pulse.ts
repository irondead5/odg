import { defineCommand } from 'citty';
import pc from 'picocolors';
import fs from 'node:fs/promises';
import path from 'node:path';

export const pulseCommand = defineCommand({
  meta: {
    name: 'pulse',
    description: 'Check architecture coverage %, drift status and next steps'
  },
  async run() {
    const manifestPath = path.join(process.cwd(), '.odg', 'radar-manifest.json');
    try {
      const content = await fs.readFile(manifestPath, 'utf-8');
      const manifest = JSON.parse(content);

      const cov = manifest.summary?.coverage || manifest.coverage || {};
      const total = cov.total ?? cov.totalPct ?? 0;
      const diagrams = cov.diagrams ?? cov.diagramsPct ?? 0;
      const docs = cov.documents ?? cov.documentsPct ?? 0;

      console.log(pc.bold('\n📊 ODG PULSE — Estado de Cobertura de Arquitectura:'));
      console.log(`  🎯 Cobertura Total:     ${pc.cyan(`${total}%`)}`);
      console.log(`  📐 Diagramas Cubiertos: ${pc.magenta(`${diagrams}%`)}`);
      console.log(`  📝 Documentos Cubiertos: ${pc.yellow(`${docs}%`)}`);

      if (manifest.nextSteps?.length) {
        console.log(pc.bold('\n🚀 Siguientes Pasos Recomendados (Next Steps):'));
        for (const step of manifest.nextSteps) {
          console.log(`  • [${step.priority}] ${pc.green(step.action)} — ${step.description} (${pc.dim(`~${step.estimatedTokens} tokens`)})`);
        }
      }
      console.log('');
    } catch {
      console.log(pc.yellow('\n⚠️  No se encontró .odg/radar-manifest.json.'));
      console.log(pc.dim('Ejecuta "odg init" o "odg radar" para iniciar el escaneo.\n'));
    }
  }
});

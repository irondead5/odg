import { defineCommand } from 'citty';
import pc from 'picocolors';
import fs from 'node:fs/promises';
import path from 'node:path';

export const radarCommand = defineCommand({
  meta: {
    name: 'radar',
    description: 'Discover system modules, bounded contexts, and estimate token budget (0 LLM tokens)'
  },
  args: {
    quiet: {
      type: 'boolean',
      description: 'Run quietly without verbose table output',
      default: false
    }
  },
  async run({ args }) {
    const rootDir = process.cwd();
    const odgDir = path.join(rootDir, '.odg');
    await fs.mkdir(odgDir, { recursive: true });

    // 1. Discover modules deterministically
    const srcDir = path.join(rootDir, 'src');
    const modules: Record<string, any> = {};
    let totalFiles = 0;
    let totalLines = 0;

    try {
      const srcEntries = await fs.readdir(srcDir, { withFileTypes: true });
      for (const entry of srcEntries) {
        if (entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.startsWith('__') && entry.name !== 'node_modules') {
          const modPath = path.join(srcDir, entry.name);
          const files = await fs.readdir(modPath);
          const codeFiles = files.filter(f => !f.startsWith('.') && !f.endsWith('.pyc') && !f.endsWith('.map'));
          let modLines = 0;

          for (const f of codeFiles) {
            try {
              const fileContent = await fs.readFile(path.join(modPath, f), 'utf-8');
              modLines += fileContent.split('\n').length;
            } catch {}
          }

          const isDomain = codeFiles.some(f => f.includes('router') || f.includes('controller') || f.includes('model') || f.includes('service'));
          const docPath = `.odg/human/03-domains/${entry.name}.md`;
          let isDocumented = false;
          try {
            await fs.access(path.join(rootDir, docPath));
            isDocumented = true;
          } catch {}

          modules[entry.name] = {
            name: entry.name,
            type: isDomain ? 'domain_module' : 'shared_module',
            path: `src/${entry.name}`,
            role: `Module ${entry.name} management and domain operations`,
            fileCount: codeFiles.length,
            totalLines: modLines,
            estimatedTokens: Math.round(modLines * 9.5),
            files: codeFiles,
            documented: isDocumented,
            ...(isDocumented ? { docPath } : {})
          };

          totalFiles += codeFiles.length;
          totalLines += modLines;
        }
      }
    } catch {}

    const moduleKeys = Object.keys(modules);
    const documentedCount = moduleKeys.filter(k => modules[k].documented).length;
    const coveragePct = moduleKeys.length > 0 ? Math.round((documentedCount / moduleKeys.length) * 100) : 0;

    const manifest = {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      summary: {
        totalModules: moduleKeys.length,
        totalFiles,
        totalLines,
        estimatedTokens: Math.round(totalLines * 9.5),
        documentedModules: documentedCount,
        coverage: {
          total: coveragePct,
          diagrams: coveragePct,
          documents: Math.min(100, Math.round(coveragePct * 1.25))
        }
      },
      modules
    };

    // Save .odg/radar-manifest.json
    await fs.writeFile(
      path.join(odgDir, 'radar-manifest.json'),
      JSON.stringify(manifest, null, 2),
      'utf-8'
    );

    // 2. Ensure blueprint-scaffolded suite exists in .odg/human/
    await autoScaffoldSuite(odgDir);

    if (!args.quiet) {
      console.log(pc.bold('\n🔍 Open Docs Gen (`odg radar`) — Architectural Discovery'));
      console.log(pc.dim(`   Scanned: ${rootDir}/src\n`));

      console.log(pc.cyan('┌────────────────────┬──────────┬───────────┬───────────────────┬──────────────┐'));
      console.log(pc.cyan('│') + pc.bold(' Módulo             ') + pc.cyan('│') + pc.bold(' Archivos ') + pc.cyan('│') + pc.bold(' Líneas     ') + pc.cyan('│') + pc.bold(' Tokens Estimados   ') + pc.cyan('│') + pc.bold(' Estado        ') + pc.cyan('│'));
      console.log(pc.cyan('├────────────────────┼──────────┼───────────┼───────────────────┼──────────────┤'));

      for (const [name, mod] of Object.entries(modules)) {
        const namePad = name.padEnd(18);
        const filesPad = String(mod.fileCount).padEnd(8);
        const linesPad = String(mod.totalLines).padEnd(9);
        const tokensPad = String(mod.estimatedTokens).padEnd(17);
        const statusStr = mod.documented ? pc.green('Documentado   ') : pc.yellow('Pendiente     ');
        console.log(`${pc.cyan('│')} ${namePad} ${pc.cyan('│')} ${filesPad} ${pc.cyan('│')} ${linesPad} ${pc.cyan('│')} ${tokensPad} ${pc.cyan('│')} ${statusStr} ${pc.cyan('│')}`);
      }

      console.log(pc.cyan('└────────────────────┴──────────┴───────────┴───────────────────┴──────────────┘\n'));
      console.log(`📊 Cobertura actual: ${pc.bold(pc.cyan(coveragePct + '%'))} (${documentedCount}/${moduleKeys.length} módulos documentados)`);
      console.log(pc.dim('   Suite de documentos sincronizada en .odg/human/\n'));
    }
  }
});

async function autoScaffoldSuite(odgDir: string) {
  try {
    const blueprintPath = path.join(odgDir, 'blueprint.json');
    const raw = await fs.readFile(blueprintPath, 'utf-8');
    const blueprint = JSON.parse(raw);
    const docs = blueprint.documents || {};

    const scaffoldFiles: Record<string, { relPath: string; title: string }> = {
      technical_sow: { relPath: '01-overview/technical-sow.md', title: 'Technical Scope of Work (SOW)' },
      requirements_srs: { relPath: '02-requirements/requirements-srs.md', title: 'Software Requirements Specification (SRS)' },
      api_contracts: { relPath: '04-api/api-contracts.md', title: 'API & Contract Catalog' },
      data_dictionary: { relPath: '05-data/data-dictionary.md', title: 'Database & Data Dictionary' },
      env_runbook: { relPath: '06-ops/env-runbook.md', title: 'Operational Runbook & Environment Matrix' }
    };

    for (const [key, item] of Object.entries(scaffoldFiles)) {
      if (docs[key]) {
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

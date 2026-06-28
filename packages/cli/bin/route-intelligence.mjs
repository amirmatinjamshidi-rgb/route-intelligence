#!/usr/bin/env node
/**
 * CLI entry shim: runs dist/cli.js and auto-builds in the monorepo when dist/ is missing.
 */
import { execSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const distCli = join(packageDir, 'dist', 'cli.js');
const monorepoRoot = join(packageDir, '..', '..');
const buildScript = join(monorepoRoot, 'scripts', 'build-packages.mjs');

if (!existsSync(distCli)) {
  if (existsSync(buildScript)) {
    console.log('[route-intelligence] Building workspace packages (first run)…');
    execSync(`node "${buildScript}"`, { cwd: monorepoRoot, stdio: 'inherit' });
  }

  if (!existsSync(distCli)) {
    console.error(
      '[route-intelligence] CLI is not built. Run `npm run build` in the repo root, then retry.',
    );
    process.exit(1);
  }
}

const result = spawnSync(process.execPath, [distCli, ...process.argv.slice(2)], {
  stdio: 'inherit',
});

process.exit(result.status ?? 1);

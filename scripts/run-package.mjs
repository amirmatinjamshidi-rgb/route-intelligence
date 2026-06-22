#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { detectPackageManager, isYarnBerry } from './detect-package-manager.mjs';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const packageName = process.argv[2];
const script = process.argv[3];

if (!packageName || !script) {
  console.error('Usage: node scripts/run-package.mjs <package-name> <script-name>');
  process.exit(1);
}

const pm = detectPackageManager(rootDir);

/** @type {Record<string, string>} */
const commands = {
  npm: `npm run ${script} -w ${packageName}`,
  pnpm: `pnpm --filter ${packageName} run ${script}`,
  yarn: isYarnBerry(rootDir)
    ? `yarn workspace ${packageName} run ${script}`
    : `yarn workspace ${packageName} run ${script}`,
  bun: `npm run ${script} -w ${packageName}`,
};

const command = commands[pm] ?? commands.npm;

console.log(`[route-intelligence] Running "${script}" in ${packageName} (${pm})…`);
execSync(command, { stdio: 'inherit', cwd: rootDir, shell: true });

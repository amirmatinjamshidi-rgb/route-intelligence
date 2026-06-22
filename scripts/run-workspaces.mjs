#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { detectPackageManager, isYarnBerry } from './detect-package-manager.mjs';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const script = process.argv[2];

if (!script) {
  console.error('Usage: node scripts/run-workspaces.mjs <script-name>');
  process.exit(1);
}

const pm = detectPackageManager(rootDir);

function getBunCommand(script) {
  // Bun workspaces run in parallel without dependency ordering; delegate to npm's
  // workspace runner which respects install layout and skips missing scripts.
  return `npm run ${script} --workspaces --if-present`;
}

/** @type {Record<string, string>} */
const commands = {
  npm: `npm run ${script} --workspaces --if-present`,
  pnpm: `pnpm -r --if-present run ${script}`,
  yarn: isYarnBerry(rootDir)
    ? `yarn workspaces foreach -Apt --if-present run ${script}`
    : `yarn workspaces run ${script}`,
  bun: getBunCommand(script),
};

const command = commands[pm] ?? commands.npm;

console.log(`[route-intelligence] Running "${script}" across workspaces (${pm})…`);
execSync(command, { stdio: 'inherit', cwd: rootDir, shell: true });

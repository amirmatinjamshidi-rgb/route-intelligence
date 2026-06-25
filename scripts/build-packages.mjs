#!/usr/bin/env node
/**
 * Build workspace packages in dependency order so tsup DTS can resolve
 * sibling packages' dist/*.d.ts (npm --workspaces runs alphabetically).
 */
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');

/** @param {string[]} workspaces */
function runBuild(workspaces) {
  const flags = workspaces.map((w) => `-w ${w}`).join(' ');
  console.log(`[route-intelligence] Building: ${workspaces.join(', ')}`);
  execSync(`npm run build ${flags}`, { stdio: 'inherit', cwd: rootDir, shell: true });
}

runBuild(['@route-intelligence/shared']);

runBuild([
  '@route-intelligence/core',
  '@route-intelligence/react-router',
  '@route-intelligence/tanstack',
  '@route-intelligence/playwright',
  'eslint-plugin-route-intelligence',
  '@route-intelligence/visualizer',
]);

runBuild(['@route-intelligence/next']);

runBuild([
  '@route-intelligence/cli',
  '@route-intelligence/github-action',
  'route-intelligence-vscode',
]);

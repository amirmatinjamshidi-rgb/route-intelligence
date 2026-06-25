#!/usr/bin/env node
/**
 * Lightweight postinstall check — ensures workspace packages are linkable.
 * Skipped in CI when SKIP_VERIFY_WORKSPACES=1.
 */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

if (process.env.SKIP_VERIFY_WORKSPACES === '1') {
  process.exit(0);
}

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const sharedDist = join(rootDir, 'packages', 'shared', 'dist', 'index.js');

if (!existsSync(sharedDist)) {
  console.log(
    "[route-intelligence] Workspace packages not built yet. Run your package manager's install, then: npm run build",
  );
}

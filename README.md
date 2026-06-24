# Route Intelligence

> The React DevTools for Routing — statically analyze React/Next.js applications and build a complete graph of your routing architecture.

## Packages

| Package | Description |
|---------|-------------|
| `@route-intelligence/shared` | Shared types and interfaces |
| `@route-intelligence/core` | Graph engine, pipeline, algorithms |
| `@route-intelligence/next` | Next.js App Router + Pages Router plugin |
| `@route-intelligence/react-router` | React Router v6/v7 plugin |
| `@route-intelligence/tanstack` | TanStack Router plugin |
| `@route-intelligence/cli` | Command-line interface |
| `@route-intelligence/visualizer` | React Flow interactive graph UI |
| `route-intelligence-vscode` | VS Code extension |
| `eslint-plugin-route-intelligence` | ESLint rules |
| `@route-intelligence/github-action` | GitHub Action for PR analysis |
| `@route-intelligence/playwright` | Playwright test generation |

## Requirements

- **Node.js 22+**
- Any of: **npm 9+**, **Yarn 1 / Berry**, or **Bun 1+**

## Quick Start

Pick your package manager — all root scripts work the same:

### npm

```bash
npm install
npm run build
npm run analyze
```

### Yarn

```bash
yarn install
yarn build
yarn analyze
```

### Bun

```bash
bun install
bun run build
bun run analyze
```

## CLI Commands

After building, you can also invoke the CLI directly:

```bash
node packages/cli/dist/cli.js analyze --root .
node packages/cli/dist/cli.js graph --port 3001
node packages/cli/dist/cli.js doctor --root .
node packages/cli/dist/cli.js export --format mermaid --out ri-export
node packages/cli/dist/cli.js watch --root .
```

Or via your package manager:

```bash
npm run analyze    # build CLI + analyze project
npm run test       # run workspace tests
npm run typecheck  # typecheck all packages
```

## Lockfiles

This monorepo supports **npm**, **Yarn**, and **Bun**. Pick one package manager for your team and commit only its lockfile:

| Manager | Lockfile |
|---------|----------|
| npm | `package-lock.json` |
| Yarn | `yarn.lock` |
| Bun | `bun.lock` |

Avoid mixing installs across managers in the same checkout — delete `node_modules` and reinstall if you switch.

Root scripts auto-detect your package manager via `npm_config_user_agent` (or lockfile fallback) and run the correct workspace commands.

## Architecture

All routing intelligence flows through a typed graph model consumed by CLI, VS Code, visualizer, GitHub Action, and ESLint plugin. Framework support is plugin-based — core never depends on React.

## License

MIT

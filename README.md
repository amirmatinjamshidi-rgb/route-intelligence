# Route Intelligence

> The React DevTools for Routing — statically analyze React/Next.js applications and build a complete graph of your routing architecture.

## Use this (most people)

```bash
npm install -D @route-intelligence/cli
npx route-intelligence analyze
npx route-intelligence graph
```

One package. `analyze` writes `ri-output/graph.json`. `graph` opens `http://localhost:3001`. The CLI already pulls in core + the Next.js plugin.

## Packages

| Package | Who installs it | README |
|---------|-----------------|--------|
| [`@route-intelligence/cli`](packages/cli/README.md) | **End users** (Next.js) | CLI: analyze, graph, doctor, export, watch |
| [`@route-intelligence/core`](packages/core/README.md) | Custom Node integrations | Engine, pipeline, exporters |
| [`@route-intelligence/shared`](packages/shared/README.md) | Plugin authors | Types (`SerializedGraph`, `FrameworkPlugin`) |
| [`@route-intelligence/next`](packages/next/README.md) | Bundled with CLI | App Router + Pages Router |
| [`@route-intelligence/react-router`](packages/react-router/README.md) | Programmatic only | React Router plugin (not in CLI yet) |
| [`@route-intelligence/tanstack`](packages/tanstack/README.md) | Programmatic only | TanStack Router plugin (not in CLI yet) |
| [`@route-intelligence/visualizer`](packages/visualizer/README.md) | Embed graph in a React app | React Flow component |
| [`route-intelligence-vscode`](packages/vscode/README.md) | VS Code Marketplace | Explorer tree, hover, diagnostics |
| [`eslint-plugin-route-intelligence`](packages/eslint-plugin/README.md) | Lint after `analyze` | Broken links / dead pages |
| [`@route-intelligence/github-action`](packages/github-action/README.md) | CI | PR route report |
| [`@route-intelligence/playwright`](packages/playwright/README.md) | Optional e2e | Generate Playwright specs from the graph |

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

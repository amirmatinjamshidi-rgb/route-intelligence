# @route-intelligence/cli

Command-line interface for Route Intelligence. This is the package most users should install.

It scans a project, builds a route graph, writes exports, runs health checks, and can serve a local graph browser.

**Current analyzer plugin:** Next.js App Router + Pages Router (`@route-intelligence/next`). React Router and TanStack plugins exist as separate packages and are not wired into this CLI yet.

## Install

```bash
npm install -D @route-intelligence/cli
```

Requires **Node.js 22+**.

The CLI depends on `@route-intelligence/core` and `@route-intelligence/next`. You do not need to install those yourself.

## Quick start

From a Next.js app root:

```bash
npx route-intelligence analyze
npx route-intelligence graph
```

`analyze` writes `ri-output/graph.json`. `graph` starts a browser at `http://localhost:3001`.

The binary is also registered as `ri`:

```bash
npx ri doctor
```

## Commands

### `analyze`

Analyze routing and write a graph file.

```bash
npx route-intelligence analyze --root . --format json --out ri-output
```

| Option | Default | Description |
|--------|---------|-------------|
| `-r, --root` | `.` | Project root |
| `-f, --format` | `json` | `json`, `mermaid`, `plantuml`, `dot`, `html`, `markdown` |
| `-o, --out` | `ri-output` | Output directory |

Writes `graph.<ext>` in the output directory. Prints up to 10 diagnostics.

### `graph`

Analyze, write `ri-output/graph.json`, then serve an interactive HTML view.

```bash
npx route-intelligence graph --port 3001 --host localhost
```

| Option | Default | Description |
|--------|---------|-------------|
| `-r, --root` | `.` | Project root |
| `-p, --port` | `3001` | HTTP port |
| `--host` | `localhost` | Bind host |

Open `http://localhost:3001`. Search routes, filter dead/API/dynamic nodes, click a node for path/file/depth.

### `doctor`

Health check. Lists errors and warnings from the analyzer.

```bash
npx route-intelligence doctor --root .
npx route-intelligence doctor --strict --format json
```

| Option | Default | Description |
|--------|---------|-------------|
| `-r, --root` | `.` | Project root |
| `--strict` | off | Exit `1` on warnings as well as errors |
| `-f, --format` | `text` | `text` or `json` |

Exit `1` if any error exists. With `--strict`, warnings also fail the process.

### `docs`

Generate route documentation.

```bash
npx route-intelligence docs --format markdown --out docs/routes
npx route-intelligence docs --format html
```

Writes `routes.md` or `routes.html`.

### `export`

Export the graph without the HTML/markdown doc wrappers used by `docs`.

```bash
npx route-intelligence export --format mermaid --out ri-export
```

Formats: `json`, `mermaid`, `plantuml`, `dot`.

### `watch`

Watch the project and re-analyze on change.

```bash
npx route-intelligence watch --root .
```

Logs added/removed node counts. Stop with Ctrl+C.

## What it scans

Default include globs:

- `app/**`
- `pages/**`
- `src/**`
- `middleware.ts`

Excluded: `node_modules`, `.next`, `dist`, test files.

Cache directory: `.route-intelligence`.

## See results

| Goal | Command |
|------|---------|
| JSON graph | `analyze` then open `ri-output/graph.json` |
| Browser UI | `graph` |
| CI gate | `doctor --strict` |
| Docs / diagrams | `docs` or `export --format mermaid` |

## License

MIT

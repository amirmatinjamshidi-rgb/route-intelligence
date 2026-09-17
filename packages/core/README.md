# @route-intelligence/core

Graph engine, analysis pipeline, algorithms, and exporters. Framework-agnostic: it never depends on React or Next.js.

You usually get this package transitively via `@route-intelligence/cli`. Install it directly only when you want to run analysis from your own Node code.

## Install

```bash
npm install @route-intelligence/core
```

You also need at least one framework plugin (for example `@route-intelligence/next`) and pass it in `plugins`.

## Analyze from code

```ts
import { createAnalyzer, exportJson, exportMermaid } from '@route-intelligence/core';
import { NextPlugin } from '@route-intelligence/next';

const analyzer = createAnalyzer({
  root: process.cwd(),
  plugins: [NextPlugin()],
  include: ['app/**', 'pages/**', 'src/**', 'middleware.ts'],
  exclude: ['**/node_modules/**', '**/.next/**'],
});

const result = await analyzer.analyze();

console.log(result.metadata.totalRoutes);
console.log(result.diagnostics);

const json = exportJson(result.graph, process.cwd());
const mermaid = exportMermaid(result.graph);
```

## Pipeline

`createAnalyzer` runs a staged pipeline:

1. File system scan
2. Route discovery (plugins)
3. Parse / AST
4. Semantic analysis
5. Navigation analysis
6. Static analysis (dead routes, cycles, broken links)
7. Graph build + metrics

Plugins register through `PluginRegistry`. Active plugins are those whose `detect()` returns true for the project.

## Watch

```ts
const watcher = analyzer.watch();

watcher.on('update', (patch) => {
  console.log(patch.addedNodes.length, patch.removedNodeIds.length);
});

watcher.on('error', (err) => console.error(err));

await watcher.stop();
```

Uses chokidar plus an incremental cache (default directory `.route-intelligence`).

## Graph API

`RouteGraph` stores nodes (routes, layouts, middleware, API routes, …) and typed edges (navigation, redirect, layout-parent, prefetch, …).

Algorithms:

- `findCycles`
- `findDeadRoutes`
- `findShortestPath`
- `detectInfiniteRedirects`
- `getMostConnected`
- `computeMetrics` / `metricsToMetadata`

## Exporters

| Function | Output |
|----------|--------|
| `exportJson` | Serialized graph JSON |
| `exportMermaid` | Mermaid flowchart (ELK, left-to-right) |
| `exportPlantUML` | PlantUML |
| `exportDot` | Graphviz DOT |
| `exportHtml` | Standalone HTML report |
| `exportMarkdown` | Markdown route list |

## Config helper

```ts
import { defineConfig } from '@route-intelligence/core';

export default defineConfig({
  root: '.',
  plugins: [],
});
```

Types for `AnalyzerConfig`, `AnalysisResult`, `Diagnostic`, and `FrameworkPlugin` are re-exported from `@route-intelligence/shared`.

## License

MIT

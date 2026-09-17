# @route-intelligence/shared

Shared TypeScript types and helpers used by every Route Intelligence package.

There is no runtime analyzer here. Install this only if you write a plugin, consume `SerializedGraph`, or share types across packages.

## Install

```bash
npm install @route-intelligence/shared
```

CLI / core already depend on this. App users do not need a direct install.

## What it exports

### Graph model

- `RouteNodeType` — `route`, `layout`, `template`, `loading`, `error`, `middleware`, `api-route`, …
- `RouteEdgeType` — `navigation`, `redirect`, `layout-parent`, `prefetch`, `middleware-match`, …
- Node/edge attributes, conditions (`auth`, `locale`, `feature-flag`, …)
- `SerializedGraph` — JSON shape written to `ri-output/graph.json`
- `Diagnostic` + rule ids (`dead-route`, `broken-link`, `circular-navigation`, …)
- `createDefaultNodeAttributes` / `createDefaultEdgeAttributes`

### Plugin contract

`FrameworkPlugin` is the interface framework packages implement:

- `detect(ctx)` — is this framework present?
- `configure(ctx)` — plugin-specific config
- `discoverRoutes(ctx)` — yield `RawRoute`
- `analyzeFile(file, ctx)` — navigation edges from a file
- `enrichGraph(graph, ctx)` — extra edges (middleware, layouts)
- `runDiagnostics(graph)` — plugin-specific diagnostics

Also: `AnalyzerConfig`, `AnalysisResult`, `GraphPatch`, `defineConfig`.

## Typical import

```ts
import type { SerializedGraph, FrameworkPlugin, Diagnostic } from '@route-intelligence/shared';
import { createDefaultNodeAttributes } from '@route-intelligence/shared';
```

ESLint, Playwright, and the visualizer all read `SerializedGraph`. Keep that type stable when changing this package.

## License

MIT

# @route-intelligence/react-router

React Router v6/v7 plugin for Route Intelligence.

Discovers route modules under a routes directory and records `Link` / `NavLink` / `navigate` edges.

**Not wired into `@route-intelligence/cli` yet.** Use it with `createAnalyzer` from `@route-intelligence/core`.

## Install

```bash
npm install @route-intelligence/react-router @route-intelligence/core
```

## Usage

```ts
import { createAnalyzer, exportJson } from '@route-intelligence/core';
import { ReactRouterPlugin } from '@route-intelligence/react-router';

const analyzer = createAnalyzer({
  root: process.cwd(),
  plugins: [
    ReactRouterPlugin({
      routesDir: 'src/routes',
      routerFile: 'src/router.tsx',
    }),
  ],
  include: ['src/**'],
  exclude: ['**/node_modules/**', '**/dist/**'],
});

const result = await analyzer.analyze();
console.log(exportJson(result.graph, process.cwd()));
```

## Detection

`detect()` is true if `package.json` lists `react-router` or `react-router-dom`, or if `routerFile` exists.

## Discovery

Globs `**/*.{tsx,jsx}` under `routesDir` (default `src/routes`). File path becomes URL path. `index` is stripped. `:` in the path marks dynamic segments; `*` marks catch-all.

## File analysis

- JSX `Link` and `NavLink` → `navigation` edges
- `navigate(...)` / `router.*` calls → `navigation` edges

Static destinations only. Template / fully dynamic targets are skipped.

## License

MIT

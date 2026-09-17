# @route-intelligence/tanstack

TanStack Router plugin for Route Intelligence.

Discovers files under a file-based routes directory and records `Link` / `navigate` edges.

**Not wired into `@route-intelligence/cli` yet.** Use it with `createAnalyzer` from `@route-intelligence/core`.

## Install

```bash
npm install @route-intelligence/tanstack @route-intelligence/core
```

## Usage

```ts
import { createAnalyzer, exportMermaid } from '@route-intelligence/core';
import { TanStackPlugin } from '@route-intelligence/tanstack';

const analyzer = createAnalyzer({
  root: process.cwd(),
  plugins: [TanStackPlugin({ routesDir: 'src/routes' })],
  include: ['src/**'],
  exclude: ['**/node_modules/**'],
});

const result = await analyzer.analyze();
console.log(exportMermaid(result.graph));
```

## Detection

`detect()` is true if `package.json` dependencies include `@tanstack/react-router`.

## Discovery

Globs `**/*.{tsx,ts}` under `routesDir` (default `src/routes`). `$param` in the path is treated as dynamic. `_splat` is treated as catch-all.

## File analysis

- JSX links → `navigation`
- `navigate(...)` calls → `navigation` (source tagged as `router.push`)

Static destinations only.

## License

MIT

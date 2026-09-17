# @route-intelligence/next

Next.js framework plugin for Route Intelligence.

Discovers App Router and Pages Router files, follows `Link` / `redirect` / `router.push` / middleware, and attaches layout and middleware edges to the graph.

The CLI already depends on this package and registers `NextPlugin()` for you.

## Install

```bash
npm install @route-intelligence/next
```

Direct install is only needed for custom `createAnalyzer` setups.

## Usage with core

```ts
import { createAnalyzer } from '@route-intelligence/core';
import { NextPlugin, createNextAppRouterPlugin, createNextPagesRouterPlugin } from '@route-intelligence/next';

const analyzer = createAnalyzer({
  root: process.cwd(),
  plugins: [NextPlugin({ basePath: '' })],
  include: ['app/**', 'pages/**', 'src/**', 'middleware.ts'],
  exclude: ['**/node_modules/**', '**/.next/**'],
});
```

`NextPlugin()` combines App Router + Pages Router. Use `createNextAppRouterPlugin` or `createNextPagesRouterPlugin` if you want one side only.

## Options

```ts
NextPlugin({
  appDir: 'app',       // or 'src/app' is auto-detected
  pagesDir: 'pages',   // or 'src/pages' is auto-detected
  srcDir: 'src',
  basePath: '',
  customNavigationWrappers: [],
});
```

Detection looks for `app/`, `src/app/`, `pages/`, `src/pages/`.

## What it understands

**App Router files:** `page`, `layout`, `template`, `loading`, `error`, `global-error`, `not-found`, `forbidden`, `unauthorized`, `route` (API).

**URL segments:** dynamic `[id]`, catch-all `[...slug]`, optional `[[...slug]]`, route groups `(marketing)`, parallel slots `@modal`, intercepting routes `(.)` `(..)` `(...)`.

**Navigation:** JSX `Link` (`href`), `redirect` / `permanentRedirect`, `router.push` / prefetch, `NextResponse.redirect` / `rewrite`, `window.location`, `history.*`.

**Middleware:** `middleware.ts` / `middleware.js` / `src/middleware.ts`. Matcher analysis when ts-morph can parse the file; otherwise a catch-all `middleware-match` edge to every route.

**Diagnostics:** `shadowed-route` when two dynamic routes share a path.

## License

MIT

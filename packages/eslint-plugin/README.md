# eslint-plugin-route-intelligence

ESLint rules that check links and redirects against a Route Intelligence graph.

Rules read `ri-output/graph.json` (or `.route-intelligence/graph.json`). Run the CLI analyzer first, or rules no-op.

## Install

```bash
npm install -D eslint-plugin-route-intelligence @route-intelligence/cli
```

Peer: ESLint 9+.

## Setup (flat config)

```js
// eslint.config.js
import routeIntelligence from 'eslint-plugin-route-intelligence';

export default [
  {
    plugins: { 'route-intelligence': routeIntelligence },
    rules: {
      'route-intelligence/no-broken-route': 'error',
      'route-intelligence/no-invalid-redirect': 'error',
      'route-intelligence/no-dead-page': 'warn',
      'route-intelligence/prefer-route-constants': 'off',
      'route-intelligence/detect-route-cycles': 'warn',
    },
  },
];
```

Generate the graph before lint:

```bash
npx route-intelligence analyze --out ri-output
npx eslint .
```

## Rules

### `no-broken-route`

Error when a JSX `href="..."` string is not a known `route` path in the graph. Skips `http` URLs and hashes.

### `no-invalid-redirect`

Error when `redirect('...')` or `permanentRedirect('...')` targets a path missing from the graph.

### `no-dead-page`

Warning if the current file matches a graph node with `isDead`.

### `prefer-route-constants`

Suggestion: do not hardcode `href="/..."` strings. Prefer shared route constants.

### `detect-route-cycles`

Warning if a `push` / `navigate` / `redirect` call sits on a node that already has a self-cycle in the graph.

## Graph locations

Looked up from `context.cwd`:

1. `ri-output/graph.json`
2. `.route-intelligence/graph.json`

Commit or generate that file in CI before ESLint runs.

## License

MIT

# @route-intelligence/playwright

Generate Playwright test source from a Route Intelligence `SerializedGraph`.

Does not run tests. It prints `.spec.ts` text you write to disk.

## Install

```bash
npm install -D @route-intelligence/playwright @playwright/test @route-intelligence/cli
```

## Workflow

```bash
npx route-intelligence analyze --format json --out ri-output
```

```ts
import { readFileSync, writeFileSync } from 'node:fs';
import {
  generateNavigationTests,
  generateBrokenLinkTests,
  generateMissingRouteTests,
} from '@route-intelligence/playwright';
import type { SerializedGraph } from '@route-intelligence/shared';

const graph = JSON.parse(readFileSync('ri-output/graph.json', 'utf8')) as SerializedGraph;

writeFileSync(
  'e2e/routes.spec.ts',
  generateNavigationTests(graph, { baseUrl: 'http://localhost:3000' }),
);
writeFileSync('e2e/broken-links.spec.ts', generateBrokenLinkTests(graph));
writeFileSync('e2e/dead-routes.spec.ts', generateMissingRouteTests(graph));
```

Then:

```bash
npx playwright test
```

## APIs

### `generateNavigationTests(graph, options?)`

- One `page.goto` test per **static** (non-`[param]`) live route. Expects HTTP status `< 400`.
- Extra tests for navigation/prefetch edges between static routes (goto source; comment names the edge source).
- Skips dead routes unless `includeDeadRoutes: true`.

```ts
generateNavigationTests(graph, {
  baseUrl: 'http://localhost:3000',
  includeDeadRoutes: false,
});
```

### `generateBrokenLinkTests(graph)`

Tests for edges whose diagnostics include `broken-link`. If none, a passing placeholder test.

### `generateMissingRouteTests(graph)`

`test.todo` entries for dead `route` nodes.

## License

MIT

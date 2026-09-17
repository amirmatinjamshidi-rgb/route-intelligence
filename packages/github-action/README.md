# @route-intelligence/github-action

GitHub Action that analyzes a Next.js repo on pull requests, writes `ri-output/graph.json` and a markdown summary, and can fail the job on routing errors.

You can also import `diffGraphs` / `formatPrComment` from the published npm package in custom Node scripts.

## Use in a workflow

The Action entry is `action.yml` in this package. Point `uses` at the repo path (or a published Action later), not at the npm tarball.

```yaml
name: Route Intelligence

on:
  pull_request:
    branches: [main]

jobs:
  routes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - uses: ./packages/github-action
        with:
          root: .
          fail-on-error: true
```

If the Action is published to the GitHub Marketplace, replace `uses: ./packages/github-action` with `owner/repo@tag`.

## Inputs

| Input | Default | Description |
|-------|---------|-------------|
| `root` | `.` | Project root (`INPUT_ROOT`) |
| `fail-on-error` | `true` | Exit 1 when broken links or redirect cycles exist |

Runs only when `GITHUB_ACTIONS` is set. Analyzer uses `NextPlugin()`.

## Outputs on disk

- `ri-output/graph.json` — serialized graph
- `ri-output/pr-comment.md` — markdown report (added routes, dead routes, cycles, risk delta)

The Action logs the same markdown to the job console. Wire it to `gh pr comment` yourself if you want it on the PR.

## Programmatic API

```ts
import { diffGraphs, formatPrComment } from '@route-intelligence/github-action';
import type { SerializedGraph } from '@route-intelligence/shared';

const diff = diffGraphs(before, after);
console.log(formatPrComment(diff));
```

`diffGraphs` compares route paths, conditions, broken-link counts, dead nodes, cycle count, and `riskScore`.

## License

MIT

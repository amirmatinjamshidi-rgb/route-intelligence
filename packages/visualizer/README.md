# @route-intelligence/visualizer

React component that renders a `SerializedGraph` with [React Flow](https://reactflow.dev/).

The CLI `graph` command currently serves its own built-in HTML viewer and does **not** import this package. Use the visualizer when you want the graph inside your own React app (docs site, dashboard, Storybook).

## Install

```bash
npm install @route-intelligence/visualizer @xyflow/react react react-dom
```

Peer-style usage: React 19 and `@xyflow/react` are listed as dependencies of this package.

## Usage

```tsx
import { RouteVisualizer } from '@route-intelligence/visualizer';
import type { SerializedGraph } from '@route-intelligence/shared';
import graph from '../ri-output/graph.json';

export function RoutesPage() {
  return <RouteVisualizer graph={graph as SerializedGraph} layout="hierarchical" />;
}
```

Produce `graph.json` first:

```bash
npx route-intelligence analyze --format json --out ri-output
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `graph` | `SerializedGraph` | required | Output of `exportJson` |
| `layout` | `'hierarchical' \| 'force' \| 'radial' \| 'flow'` | `'hierarchical'` | Layout hint (grid placement today) |

UI includes search, overlay filters (dead, API, dynamic, middleware, redirects), React Flow controls, mini-map, and background.

## Default export

```ts
import RouteVisualizer from '@route-intelligence/visualizer';
```

Same as the named export.

## License

MIT

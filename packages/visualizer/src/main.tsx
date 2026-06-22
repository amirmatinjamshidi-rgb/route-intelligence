import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouteVisualizer } from './App.js';
import type { SerializedGraph } from '@route-intelligence/shared';

async function main() {
  const response = await fetch('/graph.json');
  const graph = (await response.json()) as SerializedGraph;
  const root = createRoot(document.getElementById('root')!);
  root.render(
    <StrictMode>
      <RouteVisualizer graph={graph} />
    </StrictMode>,
  );
}

main();

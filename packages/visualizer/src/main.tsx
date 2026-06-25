import type { SerializedGraph } from '@route-intelligence/shared';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouteVisualizer } from './App.js';

async function main() {
  const response = await fetch('/graph.json');
  const graph = (await response.json()) as SerializedGraph;
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root element #root not found');
  }
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <RouteVisualizer graph={graph} />
    </StrictMode>,
  );
}

main();

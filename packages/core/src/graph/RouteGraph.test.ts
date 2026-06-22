import { describe, it, expect } from 'vitest';
import { RouteGraph } from './RouteGraph.js';
import { createDefaultNodeAttributes, createDefaultEdgeAttributes } from '@route-intelligence/shared';

describe('RouteGraph', () => {
  it('adds nodes and edges', () => {
    const graph = new RouteGraph();
    graph.addNode(
      'a',
      createDefaultNodeAttributes({ type: 'route', path: '/', filePath: '/app/page.tsx' }),
    );
    graph.addNode(
      'b',
      createDefaultNodeAttributes({ type: 'route', path: '/about', filePath: '/app/about/page.tsx' }),
    );
    graph.addEdge(
      'e1',
      'a',
      'b',
      createDefaultEdgeAttributes({ type: 'navigation', source: 'Link' }),
    );

    expect(graph.hasNode('a')).toBe(true);
    expect(graph.getAllEdges()).toHaveLength(1);
    expect(graph.findNodeByPath('/about')).toBe('b');
  });
});

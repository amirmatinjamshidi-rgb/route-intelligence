import {
  createDefaultEdgeAttributes,
  createDefaultNodeAttributes,
} from '@route-intelligence/shared';
import { describe, expect, it } from 'vitest';
import { RouteGraph } from '../graph/RouteGraph.js';
import { exportMermaid } from './MermaidExporter.js';

describe('exportMermaid', () => {
  it('chains nested routes top to bottom by path segments', () => {
    const graph = new RouteGraph();
    graph.addNode(
      'root-layout',
      createDefaultNodeAttributes({
        type: 'layout',
        path: '/#layout',
        filePath: 'app/layout.tsx',
      }),
    );
    graph.addNode(
      'locale-layout',
      createDefaultNodeAttributes({
        type: 'layout',
        path: '/[locale]/docs#layout',
        filePath: 'app/[locale]/docs/layout.tsx',
      }),
    );
    graph.addNode(
      'docs-page',
      createDefaultNodeAttributes({
        type: 'route',
        path: '/[locale]/docs',
        filePath: 'app/[locale]/docs/page.tsx',
      }),
    );
    graph.addNode(
      'api-page',
      createDefaultNodeAttributes({
        type: 'route',
        path: '/[locale]/docs/api',
        filePath: 'app/[locale]/docs/api/page.tsx',
      }),
    );
    graph.addNode(
      'cli-page',
      createDefaultNodeAttributes({
        type: 'route',
        path: '/[locale]/docs/cli',
        filePath: 'app/[locale]/docs/cli/page.tsx',
      }),
    );
    graph.addNode(
      'test-page',
      createDefaultNodeAttributes({
        type: 'route',
        path: '/[locale]/docs/cli/test',
        filePath: 'app/[locale]/docs/cli/test/page.tsx',
      }),
    );
    graph.addEdge(
      'layout-root',
      'root-layout',
      'locale-layout',
      createDefaultEdgeAttributes({ type: 'layout-parent', source: 'unknown' }),
    );

    const mermaid = exportMermaid(graph);

    expect(mermaid).toMatch(
      /^%%\{init: \{"flowchart": \{"defaultRenderer": "elk"\}\}\}%%\nflowchart LR/m,
    );
    expect(mermaid).toContain('seg_locale__docs --> seg_locale__docs__cli');
    expect(mermaid).toContain('seg_locale__docs__cli --> seg_locale__docs__cli__test');
    expect(mermaid).not.toContain('direction TB');
    expect(mermaid).not.toContain('layout-parent');
  });

  it('keeps non-layout edges as dotted links between segment nodes', () => {
    const graph = new RouteGraph();
    graph.addNode(
      'home',
      createDefaultNodeAttributes({ type: 'route', path: '/', filePath: 'app/page.tsx' }),
    );
    graph.addNode(
      'about',
      createDefaultNodeAttributes({
        type: 'route',
        path: '/about',
        filePath: 'app/about/page.tsx',
      }),
    );
    graph.addEdge(
      'nav',
      'home',
      'about',
      createDefaultEdgeAttributes({ type: 'navigation', source: 'Link' }),
    );

    const mermaid = exportMermaid(graph);

    expect(mermaid).toContain('seg_root -.->|navigation| seg_about');
  });
});

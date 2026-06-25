import { describe, expect, it } from 'vitest';
import { createDefaultEdgeAttributes, createDefaultNodeAttributes } from '../src/graph.types.js';

describe('shared types', () => {
  it('creates default node attributes', () => {
    const node = createDefaultNodeAttributes({
      type: 'route',
      path: '/',
      filePath: '/app/page.tsx',
    });
    expect(node.type).toBe('route');
    expect(node.isReachable).toBe(false);
  });

  it('creates default edge attributes', () => {
    const edge = createDefaultEdgeAttributes({
      type: 'navigation',
      source: 'Link',
    });
    expect(edge.type).toBe('navigation');
    expect(edge.isExternal).toBe(false);
  });
});

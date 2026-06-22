import type { SerializedGraph } from '@route-intelligence/shared';
import type { RouteGraph } from '../graph/RouteGraph.js';

export function exportJson(graph: RouteGraph, root: string): string {
  return JSON.stringify(graph.toJSON(root), null, 2);
}

export function exportJsonToFile(graph: RouteGraph, root: string): SerializedGraph {
  return graph.toJSON(root);
}

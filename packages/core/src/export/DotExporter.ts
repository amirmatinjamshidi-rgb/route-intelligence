import type { RouteGraph } from '../graph/RouteGraph.js';

export function exportDot(graph: RouteGraph): string {
  const lines: string[] = ['digraph RouteGraph {', '  rankdir=LR;', '  node [shape=box];'];

  for (const nodeId of graph.getAllNodeIds()) {
    const node = graph.getNode(nodeId);
    if (!node) continue;
    lines.push(`  "${escapeDot(nodeId)}" [label="${escapeDot(`${node.type}\\n${node.path}`)}"];`);
  }

  for (const edge of graph.getAllEdges()) {
    const attrs = graph.getUnderlyingGraph().getEdgeAttributes(edge.id);
    lines.push(
      `  "${escapeDot(edge.source)}" -> "${escapeDot(edge.target)}" [label="${attrs.type}"];`,
    );
  }

  lines.push('}');
  return lines.join('\n');
}

function escapeDot(s: string): string {
  return s.replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

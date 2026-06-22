import type { RouteGraph } from '../graph/RouteGraph.js';

export function exportMermaid(graph: RouteGraph): string {
  const lines: string[] = ['flowchart TD'];

  for (const nodeId of graph.getAllNodeIds()) {
    const node = graph.getNode(nodeId);
    if (!node) continue;
    const safeId = sanitizeId(nodeId);
    const label = `${node.type}: ${node.path}`;
    lines.push(`  ${safeId}["${escapeLabel(label)}"]`);
  }

  for (const edge of graph.getAllEdges()) {
    const attrs = graph.getUnderlyingGraph().getEdgeAttributes(edge.id);
    const safeSource = sanitizeId(edge.source);
    const safeTarget = sanitizeId(edge.target);
    const edgeLabel = attrs.type;
    lines.push(`  ${safeSource} -->|${edgeLabel}| ${safeTarget}`);
  }

  return lines.join('\n');
}

function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_]/g, '_');
}

function escapeLabel(label: string): string {
  return label.replace(/"/g, '\\"');
}

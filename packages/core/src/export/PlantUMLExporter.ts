import type { RouteGraph } from '../graph/RouteGraph.js';

export function exportPlantUML(graph: RouteGraph): string {
  const lines: string[] = ['@startuml', 'skinparam componentStyle rectangle'];

  for (const nodeId of graph.getAllNodeIds()) {
    const node = graph.getNode(nodeId);
    if (!node) continue;
    lines.push(`component "${node.type}\\n${node.path}" as ${sanitizeId(nodeId)}`);
  }

  for (const edge of graph.getAllEdges()) {
    const attrs = graph.getUnderlyingGraph().getEdgeAttributes(edge.id);
    lines.push(`${sanitizeId(edge.source)} --> ${sanitizeId(edge.target)} : ${attrs.type}`);
  }

  lines.push('@enduml');
  return lines.join('\n');
}

function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_]/g, '_');
}

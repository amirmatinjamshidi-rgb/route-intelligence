import { hasCycle, willCreateCycle } from 'graphology-dag';
import { bidirectional } from 'graphology-shortest-path';
import { bfsFromNode } from 'graphology-traversal';
import type { EdgeAttributes, NodeAttributes } from '@route-intelligence/shared';
import type { RouteGraph } from './RouteGraph.js';

export interface CycleResult {
  nodes: string[];
  edges: string[];
}

export function findCycles(graph: RouteGraph): CycleResult[] {
  const underlying = graph.getUnderlyingGraph();
  const cycles: CycleResult[] = [];

  if (!hasCycle(underlying)) return cycles;

  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const path: string[] = [];

  function dfs(nodeId: string): void {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    path.push(nodeId);

    for (const neighbor of underlying.outNeighbors(nodeId)) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      } else if (recursionStack.has(neighbor)) {
        const cycleStart = path.indexOf(neighbor);
        if (cycleStart >= 0) {
          cycles.push({ nodes: path.slice(cycleStart), edges: [] });
        }
      }
    }

    path.pop();
    recursionStack.delete(nodeId);
  }

  for (const nodeId of graph.getAllNodeIds()) {
    if (!visited.has(nodeId)) {
      dfs(nodeId);
    }
  }

  return cycles;
}

export function findDeadRoutes(graph: RouteGraph): string[] {
  const entryTypes: NodeAttributes['type'][] = ['route', 'layout', 'middleware'];
  const entryNodes = graph.getAllNodeIds().filter((id) => {
    const node = graph.getNode(id);
    return node && entryTypes.includes(node.type);
  });

  const reachable = new Set<string>();
  const underlying = graph.getUnderlyingGraph();

  for (const entry of entryNodes) {
    bfsFromNode(underlying, entry, (node) => {
      reachable.add(node);
    });
  }

  return graph
    .getAllNodeIds()
    .filter((id) => {
      const node = graph.getNode(id);
      if (!node || node.type !== 'route') return false;
      const incoming = graph.getIncomingEdges(id);
      const hasNavIncoming = incoming.some(
        (e) =>
          e.attributes.type === 'navigation' ||
          e.attributes.type === 'redirect' ||
          e.attributes.type === 'conditional-navigation',
      );
      return !reachable.has(id) && !hasNavIncoming && node.path !== '/';
    })
    .map((id) => id);
}

export function findShortestPath(
  graph: RouteGraph,
  sourceId: string,
  targetId: string,
): string[] | null {
  const underlying = graph.getUnderlyingGraph();
  if (!underlying.hasNode(sourceId) || !underlying.hasNode(targetId)) return null;

  try {
    return bidirectional(underlying, sourceId, targetId);
  } catch {
    return null;
  }
}

export function findConnectedComponents(graph: RouteGraph): string[][] {
  const underlying = graph.getUnderlyingGraph();
  const visited = new Set<string>();
  const components: string[][] = [];

  for (const nodeId of graph.getAllNodeIds()) {
    if (visited.has(nodeId)) continue;
    const component: string[] = [];
    bfsFromNode(underlying, nodeId, (node) => {
      if (!visited.has(node)) {
        visited.add(node);
        component.push(node);
      }
    });
    components.push(component);
  }

  return components;
}

export function detectInfiniteRedirects(graph: RouteGraph): CycleResult[] {
  const redirectEdges = graph.getAllEdges().filter((e) => {
    const attrs = graph.getUnderlyingGraph().getEdgeAttributes(e.id);
    return (
      attrs.type === 'redirect' ||
      attrs.type === 'permanent-redirect' ||
      attrs.type === 'rewrite'
    );
  });

  const cycles: CycleResult[] = [];
  const visited = new Set<string>();

  for (const edge of redirectEdges) {
    const key = `${edge.source}->${edge.target}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const path = [edge.source];
    let current = edge.target;
    const seen = new Set<string>([edge.source]);

    while (current && !seen.has(current)) {
      seen.add(current);
      path.push(current);
      const nextEdge = redirectEdges.find((e) => e.source === current);
      if (!nextEdge) break;
      current = nextEdge.target;
    }

    if (current && seen.has(current)) {
      const cycleStart = path.indexOf(current);
      cycles.push({ nodes: path.slice(cycleStart), edges: [] });
    }
  }

  return cycles;
}

export function detectFlows(
  graph: RouteGraph,
  edgeTypes: EdgeAttributes['type'][] = ['navigation', 'conditional-navigation'],
): string[][] {
  const flows: string[][] = [];
  const routeNodes = graph.findNodesByType('route');

  for (const start of routeNodes) {
    const flow: string[] = [start];
    let current = start;
    const visited = new Set<string>([start]);

    while (true) {
      const outgoing = graph.getOutgoingEdges(current).filter((e) =>
        edgeTypes.includes(e.attributes.type),
      );
      if (outgoing.length !== 1) break;
      const next = outgoing[0]?.target;
      if (!next || visited.has(next)) break;
      visited.add(next);
      flow.push(next);
      current = next;
    }

    if (flow.length > 1) flows.push(flow);
  }

  return flows;
}

export function getMostConnected(graph: RouteGraph, n = 10): Array<{ id: string; degree: number }> {
  const underlying = graph.getUnderlyingGraph();
  const degrees = graph.getAllNodeIds().map((id) => ({
    id,
    degree: underlying.degree(id),
  }));

  return degrees.sort((a, b) => b.degree - a.degree).slice(0, n);
}

export function topologicalSort(graph: RouteGraph): string[] | null {
  const underlying = graph.getUnderlyingGraph();
  if (hasCycle(underlying)) return null;

  const inDegree = new Map<string, number>();
  for (const node of graph.getAllNodeIds()) {
    inDegree.set(node, underlying.inDegree(node));
  }

  const queue = [...inDegree.entries()].filter(([, deg]) => deg === 0).map(([id]) => id);
  const sorted: string[] = [];

  while (queue.length > 0) {
    const node = queue.shift();
    if (!node) break;
    sorted.push(node);

    for (const neighbor of underlying.outNeighbors(node)) {
      const deg = (inDegree.get(neighbor) ?? 0) - 1;
      inDegree.set(neighbor, deg);
      if (deg === 0) queue.push(neighbor);
    }
  }

  return sorted.length === graph.getAllNodeIds().length ? sorted : null;
}

export function wouldCreateCycle(
  graph: RouteGraph,
  source: string,
  target: string,
): boolean {
  const underlying = graph.getUnderlyingGraph();
  return willCreateCycle(underlying, source, target);
}

export function findReachableFrom(
  graph: RouteGraph,
  startIds: string[],
): Set<string> {
  const reachable = new Set<string>();
  const underlying = graph.getUnderlyingGraph();

  for (const start of startIds) {
    if (!underlying.hasNode(start)) continue;
    bfsFromNode(underlying, start, (node) => {
      reachable.add(node);
    });
  }

  return reachable;
}

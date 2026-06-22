import type { GraphMetadata } from '@route-intelligence/shared';
import {
  detectInfiniteRedirects,
  findCycles,
  findDeadRoutes,
  getMostConnected,
} from './algorithms.js';
import type { RouteGraph } from './RouteGraph.js';

export interface GraphMetrics {
  totalRoutes: number;
  totalLayouts: number;
  totalApiRoutes: number;
  deadRouteCount: number;
  cycleCount: number;
  maxDepth: number;
  averageDepth: number;
  mostConnected: Array<{ id: string; degree: number; path: string }>;
  maintainabilityScore: number;
  riskScore: number;
}

export function computeMetrics(graph: RouteGraph): GraphMetrics {
  const routeNodes = graph.findNodesByType('route');
  const layoutNodes = graph.findNodesByType('layout');
  const apiNodes = graph.findNodesByType('api-route');
  const deadRoutes = findDeadRoutes(graph);
  const cycles = findCycles(graph);
  const redirectCycles = detectInfiniteRedirects(graph);
  const mostConnected = getMostConnected(graph, 5);

  const depths = routeNodes.map((id) => graph.getNode(id)?.depth ?? 0);
  const maxDepth = depths.length > 0 ? Math.max(...depths) : 0;
  const averageDepth =
    depths.length > 0 ? depths.reduce((a, b) => a + b, 0) / depths.length : 0;

  const deadRoutePct =
    routeNodes.length > 0 ? deadRoutes.length / routeNodes.length : 0;
  const cyclePenalty = (cycles.length + redirectCycles.length) * 5;
  const depthPenalty = maxDepth > 10 ? (maxDepth - 10) * 2 : 0;

  const maintainabilityScore = Math.max(
    0,
    Math.min(100, 100 - deadRoutePct * 40 - cyclePenalty - depthPenalty),
  );

  const riskScore = Math.max(
    0,
    Math.min(100, deadRoutePct * 30 + cyclePenalty * 2 + depthPenalty),
  );

  return {
    totalRoutes: routeNodes.length,
    totalLayouts: layoutNodes.length,
    totalApiRoutes: apiNodes.length,
    deadRouteCount: deadRoutes.length,
    cycleCount: cycles.length + redirectCycles.length,
    maxDepth,
    averageDepth,
    mostConnected: mostConnected.map((m) => ({
      ...m,
      path: graph.getNodePath(m.id) ?? m.id,
    })),
    maintainabilityScore,
    riskScore,
  };
}

export function metricsToMetadata(
  graph: RouteGraph,
  pluginIds: string[],
): GraphMetadata {
  const metrics = computeMetrics(graph);
  return {
    pluginIds,
    totalRoutes: metrics.totalRoutes,
    totalLayouts: metrics.totalLayouts,
    totalApiRoutes: metrics.totalApiRoutes,
    deadRouteCount: metrics.deadRouteCount,
    cycleCount: metrics.cycleCount,
    maintainabilityScore: metrics.maintainabilityScore,
    riskScore: metrics.riskScore,
  };
}

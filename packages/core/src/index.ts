export {
  createAnalyzer,
  defineConfig,
  RouteGraph,
  findCycles,
  findDeadRoutes,
  findShortestPath,
  detectInfiniteRedirects,
  getMostConnected,
  exportJson,
  exportMermaid,
  exportPlantUML,
  exportDot,
  exportHtml,
  exportMarkdown,
  PluginRegistry,
  IncrementalCache,
  Invalidator,
  computeGraphPatch,
} from './analyzer.js';

export type {
  AnalysisResult,
  AnalyzerConfig,
  Diagnostic,
  GraphMetadata,
  GraphPatch,
  FrameworkPlugin,
} from './analyzer.js';

export type { Analyzer, GraphWatcher } from './analyzer.js';

export { createSemanticFile } from './ast/SemanticFile.js';
export { Pipeline } from './pipeline/Pipeline.js';
export { metricsToMetadata, computeMetrics } from './graph/metrics.js';

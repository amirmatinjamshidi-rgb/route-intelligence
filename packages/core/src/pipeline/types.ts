import type {
  AnalysisContext,
  AnalyzerConfig,
  FrameworkPlugin,
  ProjectContext,
  RawRoute,
} from '@route-intelligence/shared';
import type { SemanticFile } from '@route-intelligence/shared';
import type { RouteGraph } from '../graph/RouteGraph.js';

export interface PipelineContext {
  root: string;
  config: AnalyzerConfig;
  graph: RouteGraph;
  plugins: FrameworkPlugin[];
  files: string[];
  semanticFiles: Map<string, SemanticFile>;
  routes: Map<string, RawRoute>;
  pluginConfigs: Map<string, Record<string, unknown>>;
}

export interface PipelineStage {
  readonly name: string;
  run(ctx: PipelineContext): Promise<void>;
}

export function createProjectContext(
  root: string,
  config: AnalyzerConfig,
  pluginConfig: Record<string, unknown> = {},
): ProjectContext {
  return { root, config, pluginConfig };
}

export function createAnalysisContext(
  ctx: PipelineContext,
  plugin: FrameworkPlugin,
): AnalysisContext {
  const pluginConfig = ctx.pluginConfigs.get(plugin.id) ?? {};
  return {
    root: ctx.root,
    config: ctx.config,
    pluginConfig,
    graph: ctx.graph,
    routes: ctx.routes,
  };
}

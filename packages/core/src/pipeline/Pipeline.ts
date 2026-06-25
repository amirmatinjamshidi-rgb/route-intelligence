import type { Diagnostic, GraphMetadata } from '@route-intelligence/shared';
import { FileSystemStage } from './stages/FileSystemStage.js';
import {
  ConditionalAnalysisStage,
  GraphEnrichmentStage,
  MiddlewareAnalysisStage,
  NavigationAnalysisStage,
} from './stages/NavigationAnalysisStage.js';
import { ParseStage } from './stages/ParseStage.js';
import { GraphBuildStage, RouteDiscoveryStage } from './stages/RouteDiscoveryStage.js';
import { SemanticStage } from './stages/SemanticStage.js';
import { MetricsStage, OutputStage, StaticAnalysisStage } from './stages/StaticAnalysisStage.js';
import type { PipelineContext, PipelineStage } from './types.js';

export class Pipeline {
  private readonly stages: PipelineStage[];

  constructor(stages?: PipelineStage[]) {
    this.stages = stages ?? [
      new FileSystemStage(),
      new ParseStage(),
      new SemanticStage(),
      new RouteDiscoveryStage(),
      new GraphBuildStage(),
      new NavigationAnalysisStage(),
      new MiddlewareAnalysisStage(),
      new ConditionalAnalysisStage(),
      new GraphEnrichmentStage(),
      new StaticAnalysisStage(),
      new MetricsStage(),
      new OutputStage(),
    ];
  }

  async run(ctx: PipelineContext): Promise<{
    diagnostics: Diagnostic[];
    metadata: GraphMetadata;
  }> {
    for (const stage of this.stages) {
      await stage.run(ctx);
    }

    return {
      diagnostics: ctx.diagnostics ?? [],
      metadata: ctx.metadata ?? {
        pluginIds: ctx.plugins.map((p) => p.id),
        totalRoutes: 0,
        totalLayouts: 0,
        totalApiRoutes: 0,
        deadRouteCount: 0,
        cycleCount: 0,
      },
    };
  }
}

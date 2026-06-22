import { createDefaultEdgeAttributes } from '@route-intelligence/shared';
import type { NavigationDestination } from '@route-intelligence/shared';
import type { PipelineContext, PipelineStage } from '../types.js';
import { createAnalysisContext } from '../types.js';

function resolveTargetPath(
  destination: NavigationDestination,
  ctx: PipelineContext,
): { path?: string; isExternal: boolean } {
  switch (destination.kind) {
    case 'static':
      return { path: destination.path, isExternal: false };
    case 'template-literal':
      return { path: destination.template.replace(/\$\{[^}]+\}/g, '[param]'), isExternal: false };
    case 'external':
      return { isExternal: true };
    case 'dynamic':
      return { isExternal: false };
    default: {
      const _exhaustive: never = destination;
      return _exhaustive;
    }
  }
}

function findSourceNodeId(filePath: string, ctx: PipelineContext): string | undefined {
  for (const [id, route] of ctx.routes) {
    if (route.filePath === filePath) return id;
  }
  return undefined;
}

function findTargetNodeId(path: string | undefined, ctx: PipelineContext): string | undefined {
  if (!path) return undefined;
  return ctx.graph.findNodeByPath(path);
}

export class NavigationAnalysisStage implements PipelineStage {
  readonly name = 'NavigationAnalysisStage';

  async run(ctx: PipelineContext): Promise<void> {
    for (const plugin of ctx.plugins) {
      const analysisCtx = createAnalysisContext(ctx, plugin);

      for (const [filePath, semanticFile] of ctx.semanticFiles) {
        const result = await plugin.analyzeFile(semanticFile, analysisCtx);

        for (const edge of result.edges) {
          const sourceId = edge.sourceId || findSourceNodeId(filePath, ctx);
          if (!sourceId) continue;

          let targetId = edge.targetId;
          if (!targetId && edge.targetPath) {
            targetId = findTargetNodeId(edge.targetPath, ctx);
          }

          if (!targetId) {
            const resolved = resolveTargetPath(
              edge.targetPath
                ? { kind: 'static', path: edge.targetPath }
                : { kind: 'dynamic', expression: 'unknown' },
              ctx,
            );
            if (resolved.path) {
              targetId = findTargetNodeId(resolved.path, ctx);
            }
          }

          if (!targetId) continue;

          const edgeType =
            edge.conditions.length > 0 ? 'conditional-navigation' : edge.type;

          ctx.graph.addEdge(
            `nav:${sourceId}->${targetId}:${edge.loc.line}`,
            sourceId,
            targetId,
            createDefaultEdgeAttributes({
              type: edgeType,
              source: edge.source,
              method: edge.method,
              isExternal: edge.isExternal,
              conditions: edge.conditions,
              loc: edge.loc,
            }),
          );
        }
      }
    }
  }
}

export class MiddlewareAnalysisStage implements PipelineStage {
  readonly name = 'MiddlewareAnalysisStage';

  async run(ctx: PipelineContext): Promise<void> {
    // Middleware edges are added by framework plugins during analyzeFile/enrichGraph
    for (const plugin of ctx.plugins) {
      const projectCtx = {
        root: ctx.root,
        config: ctx.config,
        pluginConfig: ctx.pluginConfigs.get(plugin.id) ?? {},
      };
      await plugin.enrichGraph(ctx.graph, projectCtx);
    }
  }
}

export class ConditionalAnalysisStage implements PipelineStage {
  readonly name = 'ConditionalAnalysisStage';

  async run(ctx: PipelineContext): Promise<void> {
    for (const nodeId of ctx.graph.getAllNodeIds()) {
      const node = ctx.graph.getNode(nodeId);
      if (!node) continue;

      const file = ctx.semanticFiles.get(node.filePath);
      if (!file) continue;

      const allConditions = file.conditionalBlocks.flatMap((b) => b.conditions);
      if (allConditions.length > 0) {
        ctx.graph.addNode(nodeId, {
          ...node,
          conditions: [...node.conditions, ...allConditions],
        });
      }
    }
  }
}

export class GraphEnrichmentStage implements PipelineStage {
  readonly name = 'GraphEnrichmentStage';

  async run(ctx: PipelineContext): Promise<void> {
    for (const nodeId of ctx.graph.getAllNodeIds()) {
      const node = ctx.graph.getNode(nodeId);
      if (!node) continue;
      const depth = node.path.split('/').filter(Boolean).length;
      ctx.graph.addNode(nodeId, { ...node, depth });
    }
  }
}

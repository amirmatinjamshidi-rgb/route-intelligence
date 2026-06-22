import {
  createDefaultNodeAttributes,
  createDefaultEdgeAttributes,
} from '@route-intelligence/shared';
import type { PipelineContext, PipelineStage } from '../types.js';
import { createProjectContext } from '../types.js';

export class RouteDiscoveryStage implements PipelineStage {
  readonly name = 'RouteDiscoveryStage';

  async run(ctx: PipelineContext): Promise<void> {
    ctx.routes.clear();

    for (const plugin of ctx.plugins) {
      const pluginConfig = ctx.pluginConfigs.get(plugin.id) ?? {};
      const projectCtx = createProjectContext(ctx.root, ctx.config, pluginConfig);

      for await (const route of plugin.discoverRoutes(projectCtx)) {
        ctx.routes.set(route.id, route);

        ctx.graph.addNode(
          route.id,
          createDefaultNodeAttributes({
            type: route.type,
            path: route.urlPath,
            filePath: route.filePath,
            segment: route.segment,
            isDynamic: route.isDynamic,
            isCatchAll: route.isCatchAll,
            isOptionalCatchAll: route.isOptionalCatchAll,
            isParallelSlot: route.isParallelSlot,
            slotName: route.slotName,
            isIntercepted: route.isIntercepted,
            interceptLevel: route.interceptLevel,
            isRouteGroup: route.isRouteGroup,
            groupName: route.groupName,
            isClientComponent: false,
            isServerComponent: true,
            tags: route.tags,
            loc: { filePath: route.filePath, line: 1, column: 1 },
          }),
        );
      }
    }
  }
}

export class GraphBuildStage implements PipelineStage {
  readonly name = 'GraphBuildStage';

  async run(ctx: PipelineContext): Promise<void> {
    for (const route of ctx.routes.values()) {
      if (route.parentLayoutId && ctx.graph.hasNode(route.parentLayoutId)) {
        ctx.graph.addEdge(
          `layout-parent:${route.parentLayoutId}->${route.id}`,
          route.parentLayoutId,
          route.id,
          createDefaultEdgeAttributes({
            type: 'layout-parent',
            source: 'unknown',
          }),
        );
      }

      if (route.parentTemplateId && ctx.graph.hasNode(route.parentTemplateId)) {
        ctx.graph.addEdge(
          `template-parent:${route.parentTemplateId}->${route.id}`,
          route.parentTemplateId,
          route.id,
          createDefaultEdgeAttributes({
            type: 'template-parent',
            source: 'unknown',
          }),
        );
      }
    }
  }
}

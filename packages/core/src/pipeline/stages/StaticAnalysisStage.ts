import type { Diagnostic, EdgeAttributes } from '@route-intelligence/shared';
import { detectInfiniteRedirects, findCycles, findDeadRoutes } from '../../graph/algorithms.js';
import type { PipelineContext, PipelineStage } from '../types.js';
import { createProjectContext } from '../types.js';

export class StaticAnalysisStage implements PipelineStage {
  readonly name = 'StaticAnalysisStage';

  async run(ctx: PipelineContext): Promise<void> {
    const diagnostics: Diagnostic[] = [];

    diagnostics.push(...this.checkDeadRoutes(ctx));
    diagnostics.push(...this.checkBrokenLinks(ctx));
    diagnostics.push(...this.checkRedirectCycles(ctx));
    diagnostics.push(...this.checkCircularNavigation(ctx));
    diagnostics.push(...this.checkDuplicateRoutes(ctx));
    diagnostics.push(...this.checkOpenRedirects(ctx));

    for (const plugin of ctx.plugins) {
      const projectCtx = createProjectContext(
        ctx.root,
        ctx.config,
        ctx.pluginConfigs.get(plugin.id) ?? {},
      );
      const pluginDiags = await plugin.runDiagnostics(ctx.graph);
      diagnostics.push(...pluginDiags);
    }

    for (const diag of diagnostics) {
      if (diag.nodeId && ctx.graph.hasNode(diag.nodeId)) {
        const node = ctx.graph.getNode(diag.nodeId);
        if (node) {
          ctx.graph.addNode(diag.nodeId, {
            ...node,
            diagnostics: [...node.diagnostics, diag],
            isDead: diag.ruleId === 'dead-route' ? true : node.isDead,
          });
        }
      }
    }

    ctx.diagnostics = diagnostics;
  }

  private checkDeadRoutes(ctx: PipelineContext & { diagnostics?: Diagnostic[] }): Diagnostic[] {
    const dead = findDeadRoutes(ctx.graph);
    return dead.map((nodeId) => {
      const node = ctx.graph.getNode(nodeId);
      return {
        ruleId: 'dead-route',
        severity: 'warning' as const,
        message: `Route "${node?.path ?? nodeId}" appears to be unreachable`,
        nodeId,
        loc: node?.loc,
      };
    });
  }

  private checkBrokenLinks(ctx: PipelineContext): Diagnostic[] {
    const diags: Diagnostic[] = [];

    for (const edge of ctx.graph.getAllEdges()) {
      const attrs = ctx.graph.getUnderlyingGraph().getEdgeAttributes(edge.id);
      if (
        attrs.type !== 'navigation' &&
        attrs.type !== 'conditional-navigation' &&
        attrs.type !== 'prefetch'
      ) {
        continue;
      }

      if (attrs.isExternal) continue;

      const targetNode = ctx.graph.getNode(edge.target);
      if (!targetNode && !attrs.conditions.some((c) => c.kind === 'unknown')) {
        diags.push({
          ruleId: 'broken-link',
          severity: 'error',
          message: 'Navigation target does not resolve to a known route',
          edgeId: edge.id,
          loc: attrs.loc,
        });
      }
    }

    return diags;
  }

  private checkRedirectCycles(ctx: PipelineContext): Diagnostic[] {
    const cycles = detectInfiniteRedirects(ctx.graph);
    return cycles.map((cycle) => ({
      ruleId: 'redirect-cycle',
      severity: 'error' as const,
      message: `Redirect cycle detected: ${cycle.nodes.join(' -> ')}`,
      nodeId: cycle.nodes[0],
    }));
  }

  private checkCircularNavigation(ctx: PipelineContext): Diagnostic[] {
    const cycles = findCycles(ctx.graph);
    return cycles.map((cycle) => ({
      ruleId: 'circular-navigation',
      severity: 'warning' as const,
      message: `Navigation cycle detected: ${cycle.nodes.join(' -> ')}`,
      nodeId: cycle.nodes[0],
    }));
  }

  private checkDuplicateRoutes(ctx: PipelineContext): Diagnostic[] {
    const pathMap = new Map<string, string[]>();

    for (const nodeId of ctx.graph.getAllNodeIds()) {
      const node = ctx.graph.getNode(nodeId);
      if (!node || node.type !== 'route') continue;
      const existing = pathMap.get(node.path) ?? [];
      existing.push(nodeId);
      pathMap.set(node.path, existing);
    }

    const diags: Diagnostic[] = [];
    for (const [path, ids] of pathMap) {
      if (ids.length > 1) {
        diags.push({
          ruleId: 'duplicate-route',
          severity: 'error',
          message: `Duplicate route path "${path}" found in ${ids.length} locations`,
          nodeId: ids[0],
        });
      }
    }

    return diags;
  }

  private checkOpenRedirects(ctx: PipelineContext): Diagnostic[] {
    const diags: Diagnostic[] = [];
    const redirectTypes: EdgeAttributes['type'][] = ['redirect', 'permanent-redirect'];

    for (const edge of ctx.graph.getAllEdges()) {
      const attrs = ctx.graph.getUnderlyingGraph().getEdgeAttributes(edge.id);
      if (!redirectTypes.includes(attrs.type)) continue;

      const hasDynamicCondition = attrs.conditions.some(
        (c) => c.expression.includes('searchParams') || c.expression.includes('query'),
      );

      if (hasDynamicCondition) {
        diags.push({
          ruleId: 'open-redirect',
          severity: 'warning',
          message: 'Potential open redirect: destination may be user-controlled',
          edgeId: edge.id,
          loc: attrs.loc,
        });
      }
    }

    return diags;
  }
}

declare module '../types.js' {
  interface PipelineContext {
    diagnostics?: Diagnostic[];
  }
}

export class MetricsStage implements PipelineStage {
  readonly name = 'MetricsStage';

  async run(ctx: PipelineContext): Promise<void> {
    const { metricsToMetadata } = await import('../../graph/metrics.js');
    ctx.metadata = metricsToMetadata(
      ctx.graph,
      ctx.plugins.map((p) => p.id),
    );
  }
}

declare module '../types.js' {
  interface PipelineContext {
    metadata?: import('@route-intelligence/shared').GraphMetadata;
  }
}

export class OutputStage implements PipelineStage {
  readonly name = 'OutputStage';

  async run(_ctx: PipelineContext): Promise<void> {
    // Output handled by CLI/exporters
  }
}

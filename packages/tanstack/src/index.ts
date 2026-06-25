import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type {
  AnalysisContext,
  Diagnostic,
  FileAnalysisResult,
  FrameworkPlugin,
  PluginConfig,
  ProjectContext,
  RawRoute,
  RouteGraphLike,
  SemanticFile,
} from '@route-intelligence/shared';
import fg from 'fast-glob';

export interface TanStackPluginOptions {
  routesDir?: string;
}

export function TanStackPlugin(options: TanStackPluginOptions = {}): FrameworkPlugin {
  const opts = { routesDir: 'src/routes', ...options };

  return {
    id: 'tanstack-router',
    name: 'TanStack Router',
    version: '0.1.0',
    capabilities: {
      supportsAppRouter: false,
      supportsPagesRouter: false,
      supportsMiddleware: false,
      supportsApiRoutes: false,
      supportsI18n: false,
      supportsIncrementalAnalysis: true,
    },

    async detect(ctx: ProjectContext): Promise<boolean> {
      const pkgPath = join(ctx.root, 'package.json');
      if (!existsSync(pkgPath)) return false;
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as {
        dependencies?: Record<string, string>;
      };
      return Boolean(pkg.dependencies?.['@tanstack/react-router']);
    },

    async configure(_ctx: ProjectContext): Promise<PluginConfig> {
      return { routesDir: opts.routesDir };
    },

    async *discoverRoutes(ctx: ProjectContext): AsyncIterable<RawRoute> {
      const routesPath = join(ctx.root, opts.routesDir);
      if (!existsSync(routesPath)) return;

      const files = await fg(['**/*.{tsx,ts}'], {
        cwd: routesPath,
        absolute: true,
        ignore: ['**/*.test.*'],
      });

      for (const filePath of files) {
        const rel = filePath.replace(routesPath, '').replace(/\\/g, '/');
        const urlPath =
          rel
            .replace(/\.(tsx|ts)$/, '')
            .replace(/\/index$/, '')
            .replace(/^\//, '') || '/';

        yield {
          id: `tanstack:${urlPath}`,
          type: 'route',
          filePath,
          urlPath: urlPath.startsWith('/') ? urlPath : `/${urlPath}`,
          segment: urlPath.split('/').pop() ?? '',
          isDynamic: urlPath.includes('$'),
          isCatchAll: urlPath.includes('_splat'),
          isOptionalCatchAll: false,
          isParallelSlot: false,
          isIntercepted: false,
          isRouteGroup: false,
          tags: ['tanstack-router'],
        };
      }
    },

    async analyzeFile(file: SemanticFile, ctx: AnalysisContext): Promise<FileAnalysisResult> {
      const edges: FileAnalysisResult['edges'] = [];
      const sourceId = [...ctx.routes.values()].find((r) => r.filePath === file.path)?.id ?? '';

      for (const link of file.jsxLinks) {
        edges.push({
          sourceId,
          targetPath: link.destination.kind === 'static' ? link.destination.path : undefined,
          type: 'navigation',
          source: 'Link',
          isExternal: link.destination.kind === 'external',
          conditions: link.conditions,
          loc: link.loc,
        });
      }

      for (const call of file.navigationCalls) {
        if (call.callee.includes('navigate')) {
          edges.push({
            sourceId,
            targetPath: call.destination.kind === 'static' ? call.destination.path : undefined,
            type: 'navigation',
            source: 'router.push',
            method: call.method,
            isExternal: false,
            conditions: call.conditions,
            loc: call.loc,
          });
        }
      }

      return {
        filePath: file.path,
        edges,
        conditions: [],
        tags: ['tanstack-router'],
        diagnostics: [],
      };
    },

    async enrichGraph(_graph: RouteGraphLike, _ctx: ProjectContext): Promise<void> {},

    async runDiagnostics(_graph: RouteGraphLike): Promise<Diagnostic[]> {
      return [];
    },
  };
}

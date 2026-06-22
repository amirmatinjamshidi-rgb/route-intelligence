import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import fg from 'fast-glob';
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

export interface ReactRouterPluginOptions {
  routesDir?: string;
  routerFile?: string;
}

export function ReactRouterPlugin(options: ReactRouterPluginOptions = {}): FrameworkPlugin {
  const opts = { routesDir: 'src/routes', routerFile: 'src/router.tsx', ...options };

  return {
    id: 'react-router',
    name: 'React Router',
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
      return Boolean(
        pkg.dependencies?.['react-router'] ||
          pkg.dependencies?.['react-router-dom'] ||
          existsSync(join(ctx.root, opts.routerFile)),
      );
    },

    async configure(ctx: ProjectContext): Promise<PluginConfig> {
      return { routesDir: opts.routesDir, routerFile: opts.routerFile };
    },

    async *discoverRoutes(ctx: ProjectContext): AsyncIterable<RawRoute> {
      const files = await fg(['**/*.{tsx,jsx}'], {
        cwd: join(ctx.root, opts.routesDir),
        absolute: true,
        ignore: ['**/*.test.*', '**/*.spec.*'],
      });

      for (const filePath of files) {
        const rel = filePath.replace(join(ctx.root, opts.routesDir), '').replace(/\\/g, '/');
        const urlPath = rel
          .replace(/\.(tsx|jsx)$/, '')
          .replace(/\/index$/, '')
          .replace(/^\//, '') || '/';

        yield {
          id: `react-router:${urlPath}`,
          type: 'route',
          filePath,
          urlPath: urlPath.startsWith('/') ? urlPath : `/${urlPath}`,
          segment: urlPath.split('/').pop() ?? '',
          isDynamic: urlPath.includes(':'),
          isCatchAll: urlPath.includes('*'),
          isOptionalCatchAll: false,
          isParallelSlot: false,
          isIntercepted: false,
          isRouteGroup: false,
          tags: ['react-router'],
        };
      }
    },

    async analyzeFile(file: SemanticFile, ctx: AnalysisContext): Promise<FileAnalysisResult> {
      const edges: FileAnalysisResult['edges'] = [];
      const sourceId = [...ctx.routes.values()].find((r) => r.filePath === file.path)?.id ?? '';

      for (const link of file.jsxLinks) {
        if (link.componentName === 'Link' || link.componentName === 'NavLink') {
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
      }

      for (const call of file.navigationCalls) {
        if (call.callee.includes('navigate') || call.callee.startsWith('router.')) {
          edges.push({
            sourceId,
            targetPath: call.destination.kind === 'static' ? call.destination.path : undefined,
            type: 'navigation',
            source: call.callee.startsWith('router.') ? (call.callee as 'router.push') : 'Navigate',
            method: call.method,
            isExternal: call.destination.kind === 'external',
            conditions: call.conditions,
            loc: call.loc,
          });
        }
      }

      return { filePath: file.path, edges, conditions: [], tags: ['react-router'], diagnostics: [] };
    },

    async enrichGraph(_graph: RouteGraphLike, _ctx: ProjectContext): Promise<void> {},

    async runDiagnostics(_graph: RouteGraphLike): Promise<Diagnostic[]> {
      return [];
    },
  };
}

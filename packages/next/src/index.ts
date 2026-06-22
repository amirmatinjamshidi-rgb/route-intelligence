import { existsSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, sep } from 'node:path';
import { Project } from 'ts-morph';
import { analyzeMiddlewareFile, applyMiddlewareToGraph } from './middleware.js';
import type {
  AnalysisContext,
  Diagnostic,
  DiscoveredEdge,
  FileAnalysisResult,
  FrameworkPlugin,
  PluginCapabilities,
  PluginConfig,
  ProjectContext,
  RawRoute,
  RouteGraphLike,
  SemanticFile,
} from '@route-intelligence/shared';
import { createDefaultEdgeAttributes } from '@route-intelligence/shared';

export interface NextPluginOptions {
  appDir?: string;
  pagesDir?: string;
  srcDir?: string;
  basePath?: string;
  customNavigationWrappers?: string[];
}

const APP_FILE_CONVENTIONS: Record<string, RawRoute['type']> = {
  'page.tsx': 'route',
  'page.ts': 'route',
  'page.jsx': 'route',
  'page.js': 'route',
  'layout.tsx': 'layout',
  'layout.ts': 'layout',
  'layout.jsx': 'layout',
  'layout.js': 'layout',
  'template.tsx': 'template',
  'template.ts': 'template',
  'loading.tsx': 'loading',
  'loading.ts': 'loading',
  'error.tsx': 'error',
  'error.ts': 'error',
  'global-error.tsx': 'global-error',
  'global-error.ts': 'global-error',
  'not-found.tsx': 'not-found',
  'not-found.ts': 'not-found',
  'forbidden.tsx': 'forbidden',
  'forbidden.ts': 'forbidden',
  'unauthorized.tsx': 'unauthorized',
  'unauthorized.ts': 'unauthorized',
  'route.ts': 'api-route',
  'route.js': 'api-route',
};

const INTERCEPT_PATTERNS = [
  { prefix: '(.)', level: '.' as const },
  { prefix: '(..)(..)', level: '(..)(..)' as const },
  { prefix: '(..)', level: '..' as const },
  { prefix: '(...)', level: '...' as const },
];

function resolveAppDir(root: string, options: NextPluginOptions): string | null {
  const candidates = [
    options.appDir ? join(root, options.appDir) : null,
    join(root, 'src', 'app'),
    join(root, 'app'),
  ].filter(Boolean) as string[];

  return candidates.find((c) => existsSync(c)) ?? null;
}

function resolvePagesDir(root: string, options: NextPluginOptions): string | null {
  const candidates = [
    options.pagesDir ? join(root, options.pagesDir) : null,
    join(root, 'src', 'pages'),
    join(root, 'pages'),
  ].filter(Boolean) as string[];

  return candidates.find((c) => existsSync(c)) ?? null;
}

function parseSegment(segment: string): {
  segment: string;
  isDynamic: boolean;
  isCatchAll: boolean;
  isOptionalCatchAll: boolean;
  isRouteGroup: boolean;
  groupName?: string;
  isParallelSlot: boolean;
  slotName?: string;
  isIntercepted: boolean;
  interceptLevel?: '.' | '..' | '(..)(..)' | '...';
} {
  if (segment.startsWith('(') && segment.endsWith(')')) {
    return {
      segment,
      isDynamic: false,
      isCatchAll: false,
      isOptionalCatchAll: false,
      isRouteGroup: true,
      groupName: segment.slice(1, -1),
      isParallelSlot: false,
      isIntercepted: false,
    };
  }

  if (segment.startsWith('@')) {
    return {
      segment,
      isDynamic: false,
      isCatchAll: false,
      isOptionalCatchAll: false,
      isRouteGroup: false,
      isParallelSlot: true,
      slotName: segment.slice(1),
      isIntercepted: false,
    };
  }

  for (const { prefix, level } of INTERCEPT_PATTERNS) {
    if (segment.startsWith(prefix)) {
      return {
        segment,
        isDynamic: false,
        isCatchAll: false,
        isOptionalCatchAll: false,
        isRouteGroup: false,
        isParallelSlot: false,
        isIntercepted: true,
        interceptLevel: level,
      };
    }
  }

  const optionalCatchAll = segment.match(/^\[\[\.\.\.(.+)\]\]$/);
  if (optionalCatchAll) {
    return {
      segment: optionalCatchAll[1] ?? segment,
      isDynamic: true,
      isCatchAll: true,
      isOptionalCatchAll: true,
      isRouteGroup: false,
      isParallelSlot: false,
      isIntercepted: false,
    };
  }

  const catchAll = segment.match(/^\[\.\.\.(.+)\]$/);
  if (catchAll) {
    return {
      segment: catchAll[1] ?? segment,
      isDynamic: true,
      isCatchAll: true,
      isOptionalCatchAll: false,
      isRouteGroup: false,
      isParallelSlot: false,
      isIntercepted: false,
    };
  }

  const dynamic = segment.match(/^\[(.+)\]$/);
  if (dynamic) {
    return {
      segment: dynamic[1] ?? segment,
      isDynamic: true,
      isCatchAll: false,
      isOptionalCatchAll: false,
      isRouteGroup: false,
      isParallelSlot: false,
      isIntercepted: false,
    };
  }

  return {
    segment,
    isDynamic: false,
    isCatchAll: false,
    isOptionalCatchAll: false,
    isRouteGroup: false,
    isParallelSlot: false,
    isIntercepted: false,
  };
}

function segmentsToUrlPath(segments: string[], basePath = ''): string {
  const urlSegments: string[] = [];

  for (const seg of segments) {
    const parsed = parseSegment(seg);
    if (parsed.isRouteGroup) continue;

    if (parsed.isParallelSlot) continue;

    if (parsed.isIntercepted) {
      const name = seg.replace(/^\(\.\)+|\(\.\.\)\(\.\.\)|\(\.\.\)|\(\.\.\.\)/, '');
      urlSegments.push(name);
      continue;
    }

    if (parsed.isOptionalCatchAll) {
      urlSegments.push(`[[...${parsed.segment}]]`);
    } else if (parsed.isCatchAll) {
      urlSegments.push(`[...${parsed.segment}]`);
    } else if (parsed.isDynamic) {
      urlSegments.push(`[${parsed.segment}]`);
    } else {
      urlSegments.push(parsed.segment);
    }
  }

  const path = `/${urlSegments.join('/')}`;
  return basePath ? `${basePath}${path === '/' ? '' : path}` : path || '/';
}

function walkAppDirectory(
  dir: string,
  appRoot: string,
  basePath: string,
): RawRoute[] {
  const routes: RawRoute[] = [];

  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return routes;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const isDir = statSync(fullPath).isDirectory();

    if (isDir) {
      routes.push(...walkAppDirectory(fullPath, appRoot, basePath));
      continue;
    }

    const routeType = APP_FILE_CONVENTIONS[entry];
    if (!routeType) continue;

    const relDir = relative(appRoot, dir);
    const segments = relDir ? relDir.split(sep) : [];
    const allSegments = [...segments];
    const urlPath = segmentsToUrlPath(allSegments, basePath);
    const lastSegment = allSegments[allSegments.length - 1] ?? '';
    const parsed = lastSegment ? parseSegment(lastSegment) : parseSegment('');

    const id = `app:${allSegments.join('/')}:${entry}`;

    routes.push({
      id,
      type: routeType,
      filePath: fullPath,
      urlPath: routeType === 'route' || routeType === 'api-route' ? urlPath : `${urlPath}#${routeType}`,
      segment: parsed.segment,
      isDynamic: parsed.isDynamic,
      isCatchAll: parsed.isCatchAll,
      isOptionalCatchAll: parsed.isOptionalCatchAll,
      isParallelSlot: parsed.isParallelSlot,
      slotName: parsed.slotName,
      isIntercepted: parsed.isIntercepted,
      interceptLevel: parsed.interceptLevel,
      isRouteGroup: parsed.isRouteGroup,
      groupName: parsed.groupName,
      tags: ['next', 'app-router'],
    });
  }

  return routes;
}

function resolveParentLayout(segments: string[], routes: RawRoute[]): string | undefined {
  for (let i = segments.length; i >= 0; i--) {
    const parentSegments = segments.slice(0, i);
    const layoutId = `app:${parentSegments.join('/')}:/layout.tsx`;
    if (routes.some((r) => r.id.startsWith(`app:${parentSegments.join('/')}:`) && r.type === 'layout')) {
      const layout = routes.find(
        (r) =>
          r.type === 'layout' &&
          r.id === `app:${parentSegments.join('/')}:/layout.tsx` ||
          r.id.includes('layout') &&
          r.filePath.includes(parentSegments.join(sep)),
      );
      if (layout) return layout.id;
    }
  }
  return undefined;
}

export function createNextAppRouterPlugin(options: NextPluginOptions = {}): FrameworkPlugin {
  const opts = { appDir: 'app', basePath: '', ...options };

  return {
    id: 'next-app-router',
    name: 'Next.js App Router',
    version: '0.1.0',
    capabilities: {
      supportsAppRouter: true,
      supportsPagesRouter: false,
      supportsMiddleware: true,
      supportsApiRoutes: true,
      supportsI18n: true,
      supportsIncrementalAnalysis: true,
    } satisfies PluginCapabilities,

    async detect(ctx: ProjectContext): Promise<boolean> {
      return resolveAppDir(ctx.root, opts) !== null;
    },

    async configure(ctx: ProjectContext): Promise<PluginConfig> {
      const appDir = resolveAppDir(ctx.root, opts);
      return {
        appDir,
        basePath: opts.basePath,
        customNavigationWrappers: opts.customNavigationWrappers ?? [],
      };
    },

    async *discoverRoutes(ctx: ProjectContext): AsyncIterable<RawRoute> {
      const appDir = resolveAppDir(ctx.root, opts);
      if (!appDir) return;

      const routes = walkAppDirectory(appDir, appDir, opts.basePath ?? '');

      const middlewarePath = [
        join(ctx.root, 'middleware.ts'),
        join(ctx.root, 'middleware.js'),
        join(ctx.root, 'src', 'middleware.ts'),
      ].find((p) => existsSync(p));

      if (middlewarePath) {
        routes.push({
          id: 'middleware:main',
          type: 'middleware',
          filePath: middlewarePath,
          urlPath: '/*',
          segment: '*',
          isDynamic: false,
          isCatchAll: true,
          isOptionalCatchAll: false,
          isParallelSlot: false,
          isIntercepted: false,
          isRouteGroup: false,
          tags: ['next', 'middleware'],
        });
      }

      for (const route of routes) {
        const relDir = relative(appDir, dirname(route.filePath));
        const segments = relDir === '.' ? [] : relDir.split(sep);
        route.parentLayoutId = resolveParentLayout(segments, routes);
        yield route;
      }
    },

    async analyzeFile(file: SemanticFile, ctx: AnalysisContext): Promise<FileAnalysisResult> {
      const edges: DiscoveredEdge[] = [];
      const sourceId = findRouteIdForFile(file.path, ctx);

      for (const link of file.jsxLinks) {
        const targetPath = destinationToPath(link.destination);
        edges.push({
          sourceId: sourceId ?? '',
          targetPath,
          type: link.prefetch === false ? 'navigation' : 'prefetch',
          source: 'Link',
          isExternal: link.destination.kind === 'external',
          conditions: link.conditions,
          loc: link.loc,
        });
      }

      for (const call of file.navigationCalls) {
        const targetPath = destinationToPath(call.destination);
        let edgeType: DiscoveredEdge['type'] = 'navigation';
        let source: DiscoveredEdge['source'] = 'unknown';

        if (call.callee === 'redirect') {
          edgeType = 'redirect';
          source = 'redirect';
        } else if (call.callee === 'permanentRedirect') {
          edgeType = 'permanent-redirect';
          source = 'permanentRedirect';
        } else if (call.callee.includes('NextResponse.redirect')) {
          edgeType = 'redirect';
          source = 'NextResponse.redirect';
        } else if (call.callee.includes('NextResponse.rewrite')) {
          edgeType = 'rewrite';
          source = 'NextResponse.rewrite';
        } else if (call.callee.startsWith('router.')) {
          source = call.callee as DiscoveredEdge['source'];
          edgeType = call.callee.includes('prefetch') ? 'prefetch' : 'navigation';
        } else if (call.callee === 'window.location') {
          source = 'window.location';
        } else if (call.callee === 'window.open') {
          source = 'window.open';
        } else if (call.callee.startsWith('history.')) {
          source = call.callee as DiscoveredEdge['source'];
        }

        edges.push({
          sourceId: sourceId ?? '',
          targetPath,
          type: edgeType,
          source,
          method: call.method,
          isExternal: call.destination.kind === 'external',
          conditions: call.conditions,
          loc: call.loc,
        });
      }

      return {
        filePath: file.path,
        edges,
        conditions: file.conditionalBlocks.flatMap((b) => b.conditions),
        tags: [],
        diagnostics: [],
      };
    },

    async enrichGraph(graph: RouteGraphLike, ctx: ProjectContext): Promise<void> {
      await enrichMiddlewareGraph(graph, ctx);
      await enrichLayoutHierarchy(graph, ctx);
    },

    async runDiagnostics(graph: RouteGraphLike): Promise<Diagnostic[]> {
      const diags: Diagnostic[] = [];

      for (const nodeId of graph.getAllNodeIds()) {
        const path = graph.getNodePath(nodeId);
        if (!path) continue;

        const dynamicRoutes = graph.getAllNodeIds().filter((id) => {
          const p = graph.getNodePath(id);
          return p?.includes('[') && graph.getNodePath(id) === path;
        });

        if (dynamicRoutes.length > 1) {
          diags.push({
            ruleId: 'shadowed-route',
            severity: 'warning',
            message: `Route "${path}" may shadow another route`,
            nodeId,
          });
        }
      }

      return diags;
    },
  };
}

function destinationToPath(dest: import('@route-intelligence/shared').NavigationDestination): string | undefined {
  switch (dest.kind) {
    case 'static':
      return dest.path;
    case 'template-literal':
      return dest.template.replace(/\$\{[^}]+\}/g, '[param]');
    case 'external':
      return dest.url;
    case 'dynamic':
      return undefined;
    default: {
      const _exhaustive: never = dest;
      return _exhaustive;
    }
  }
}

function findRouteIdForFile(filePath: string, ctx: AnalysisContext): string | undefined {
  for (const [id, route] of ctx.routes) {
    if (route.filePath === filePath) return id;
  }
  return undefined;
}

async function enrichMiddlewareGraph(graph: RouteGraphLike, ctx: ProjectContext): Promise<void> {
  const middlewareId = graph.getAllNodeIds().find((id) => id.startsWith('middleware:'));
  if (!middlewareId) return;

  const middlewarePaths = [
    join(ctx.root, 'middleware.ts'),
    join(ctx.root, 'middleware.js'),
    join(ctx.root, 'src', 'middleware.ts'),
  ];

  const middlewarePath = middlewarePaths.find((p) => existsSync(p));
  if (!middlewarePath) return;

  try {
    const project = new Project({ skipAddingFilesFromTsConfig: true });
    const sourceFile = project.addSourceFileAtPath(middlewarePath);
    const analysis = analyzeMiddlewareFile(sourceFile, middlewarePath);
    applyMiddlewareToGraph(graph, middlewareId, analysis);
  } catch {
    for (const nodeId of graph.getAllNodeIds()) {
      const path = graph.getNodePath(nodeId);
      if (!path || nodeId === middlewareId) continue;

      graph.addEdge(
        `middleware-match:${middlewareId}->${nodeId}`,
        middlewareId,
        nodeId,
        createDefaultEdgeAttributes({
          type: 'middleware-match',
          source: 'unknown',
        }),
      );
    }
  }
}

async function enrichLayoutHierarchy(graph: RouteGraphLike, _ctx: ProjectContext): Promise<void> {
  // Layout hierarchy edges are built in GraphBuildStage via parentLayoutId
}

export function createNextPagesRouterPlugin(options: NextPluginOptions = {}): FrameworkPlugin {
  const opts = { pagesDir: 'pages', basePath: '', ...options };

  return {
    id: 'next-pages-router',
    name: 'Next.js Pages Router',
    version: '0.1.0',
    capabilities: {
      supportsAppRouter: false,
      supportsPagesRouter: true,
      supportsMiddleware: true,
      supportsApiRoutes: true,
      supportsI18n: false,
      supportsIncrementalAnalysis: true,
    } satisfies PluginCapabilities,

    async detect(ctx: ProjectContext): Promise<boolean> {
      return resolvePagesDir(ctx.root, opts) !== null;
    },

    async configure(ctx: ProjectContext): Promise<PluginConfig> {
      return {
        pagesDir: resolvePagesDir(ctx.root, opts),
        basePath: opts.basePath,
      };
    },

    async *discoverRoutes(ctx: ProjectContext): AsyncIterable<RawRoute> {
      const pagesDir = resolvePagesDir(ctx.root, opts);
      if (!pagesDir) return;

      const { readdirSync, statSync } = await import('node:fs');

      function walk(dir: string, segments: string[] = []): RawRoute[] {
        const routes: RawRoute[] = [];
        for (const entry of readdirSync(dir)) {
          const fullPath = join(dir, entry);
          if (statSync(fullPath).isDirectory()) {
            routes.push(...walk(fullPath, [...segments, entry]));
            continue;
          }

          const ext = entry.replace(/^(index)?\.(tsx|ts|jsx|js)$/, '');
          if (!/\.(tsx|ts|jsx|js)$/.test(entry)) continue;
          if (entry.startsWith('_')) continue;

          const isApi = segments[0] === 'api';
          const fileName = basename(entry, entry.slice(entry.lastIndexOf('.')));
          const urlSegments = [...segments];
          if (fileName !== 'index') urlSegments.push(fileName);

          const urlPath = pagesPathToUrl(urlSegments, opts.basePath ?? '', isApi);

          routes.push({
            id: `pages:${urlSegments.join('/')}:${entry}`,
            type: isApi ? 'api-route' : 'route',
            filePath: fullPath,
            urlPath,
            segment: urlSegments[urlSegments.length - 1] ?? '',
            isDynamic: urlSegments.some((s) => s.startsWith('[')),
            isCatchAll: urlSegments.some((s) => s.startsWith('[...')),
            isOptionalCatchAll: false,
            isParallelSlot: false,
            isIntercepted: false,
            isRouteGroup: false,
            tags: ['next', 'pages-router'],
          });
        }
        return routes;
      }

      for (const route of walk(pagesDir)) {
        yield route;
      }
    },

    async analyzeFile(file: SemanticFile, ctx: AnalysisContext): Promise<FileAnalysisResult> {
      return createNextAppRouterPlugin(opts).analyzeFile!(file, ctx);
    },

    async enrichGraph(graph: RouteGraphLike, ctx: ProjectContext): Promise<void> {
      await enrichMiddlewareGraph(graph, ctx);
    },

    async runDiagnostics(): Promise<Diagnostic[]> {
      return [];
    },
  };
}

function pagesPathToUrl(segments: string[], basePath: string, isApi: boolean): string {
  const mapped = segments.map((s) => {
    if (s.startsWith('[...') && s.endsWith(']')) return `[...${s.slice(4, -1)}]`;
    if (s.startsWith('[') && s.endsWith(']')) return s;
    return s;
  });

  const prefix = isApi ? '' : '';
  const path = `/${mapped.join('/')}`;
  const full = `${prefix}${path}`.replace(/\/index$/, '') || '/';
  return basePath ? `${basePath}${full === '/' ? '' : full}` : full;
}

export function NextPlugin(options: NextPluginOptions = {}): FrameworkPlugin {
  const appPlugin = createNextAppRouterPlugin(options);
  const pagesPlugin = createNextPagesRouterPlugin(options);

  return {
    id: 'next',
    name: 'Next.js',
    version: '0.1.0',
    capabilities: {
      supportsAppRouter: true,
      supportsPagesRouter: true,
      supportsMiddleware: true,
      supportsApiRoutes: true,
      supportsI18n: true,
      supportsIncrementalAnalysis: true,
    },

    async detect(ctx: ProjectContext): Promise<boolean> {
      return (await appPlugin.detect(ctx)) || (await pagesPlugin.detect(ctx));
    },

    async configure(ctx: ProjectContext): Promise<PluginConfig> {
      const appConfig = await appPlugin.configure(ctx);
      const pagesConfig = await pagesPlugin.configure(ctx);
      return { ...appConfig, ...pagesConfig, ...options };
    },

    async *discoverRoutes(ctx: ProjectContext): AsyncIterable<RawRoute> {
      if (await appPlugin.detect(ctx)) {
        yield* appPlugin.discoverRoutes(ctx);
      }
      if (await pagesPlugin.detect(ctx)) {
        yield* pagesPlugin.discoverRoutes(ctx);
      }
    },

    async analyzeFile(file: SemanticFile, ctx: AnalysisContext): Promise<FileAnalysisResult> {
      return appPlugin.analyzeFile(file, ctx);
    },

    async enrichGraph(graph: RouteGraphLike, ctx: ProjectContext): Promise<void> {
      await appPlugin.enrichGraph(graph, ctx);
      await pagesPlugin.enrichGraph(graph, ctx);
    },

    async runDiagnostics(graph: RouteGraphLike): Promise<Diagnostic[]> {
      const appDiags = await appPlugin.runDiagnostics(graph);
      const pagesDiags = await pagesPlugin.runDiagnostics(graph);
      return [...appDiags, ...pagesDiags];
    },
  };
}

export { analyzeMiddlewareFile, applyMiddlewareToGraph } from './middleware.js';
export type { NextPluginOptions as NextPluginOptionsType };

import type { Condition, Diagnostic, SourceLocation } from './graph.types.js';

export interface PluginCapabilities {
  supportsAppRouter: boolean;
  supportsPagesRouter: boolean;
  supportsMiddleware: boolean;
  supportsApiRoutes: boolean;
  supportsI18n: boolean;
  supportsIncrementalAnalysis: boolean;
}

export interface PluginConfig {
  [key: string]: unknown;
}

export interface ProjectContext {
  root: string;
  config: AnalyzerConfig;
  pluginConfig: PluginConfig;
}

export interface AnalyzerConfig {
  root: string;
  plugins: FrameworkPlugin[];
  include?: string[];
  exclude?: string[];
  cache?: {
    enabled: boolean;
    directory: string;
  };
  output?: {
    formats: string[];
    directory: string;
  };
  rules?: Record<string, 'error' | 'warn' | 'off'>;
}

export type RawRouteType =
  | 'route'
  | 'layout'
  | 'template'
  | 'loading'
  | 'error'
  | 'global-error'
  | 'not-found'
  | 'forbidden'
  | 'unauthorized'
  | 'middleware'
  | 'api-route';

export interface RawRoute {
  id: string;
  type: RawRouteType;
  filePath: string;
  urlPath: string;
  segment: string;
  isDynamic: boolean;
  isCatchAll: boolean;
  isOptionalCatchAll: boolean;
  isParallelSlot: boolean;
  slotName?: string;
  isIntercepted: boolean;
  interceptLevel?: '.' | '..' | '(..)(..)' | '...';
  isRouteGroup: boolean;
  groupName?: string;
  parentLayoutId?: string;
  parentTemplateId?: string;
  tags: string[];
}

export type NavigationDestination =
  | { kind: 'static'; path: string }
  | { kind: 'template-literal'; template: string; params: string[] }
  | { kind: 'dynamic'; expression: string }
  | { kind: 'external'; url: string };

export interface NavigationCall {
  callee: string;
  destination: NavigationDestination;
  method?: 'push' | 'replace';
  conditions: Condition[];
  loc: SourceLocation;
}

export interface JSXLink {
  componentName: string;
  destination: NavigationDestination;
  prefetch?: boolean;
  conditions: Condition[];
  loc: SourceLocation;
}

export interface SemanticImport {
  moduleSpecifier: string;
  namedImports: string[];
  defaultImport?: string;
  loc: SourceLocation;
}

export interface SemanticExport {
  name: string;
  isDefault: boolean;
  loc: SourceLocation;
}

export interface ComponentDeclaration {
  name: string;
  isDefault: boolean;
  loc: SourceLocation;
}

export interface ConditionalBlock {
  expression: string;
  conditions: Condition[];
  loc: SourceLocation;
}

export interface SemanticFile {
  readonly path: string;
  readonly isClientComponent: boolean;
  readonly isServerComponent: boolean;
  readonly exports: ReadonlyArray<SemanticExport>;
  readonly imports: ReadonlyArray<SemanticImport>;
  readonly components: ReadonlyArray<ComponentDeclaration>;
  readonly navigationCalls: ReadonlyArray<NavigationCall>;
  readonly jsxLinks: ReadonlyArray<JSXLink>;
  readonly conditionalBlocks: ReadonlyArray<ConditionalBlock>;
  /** Escape hatch for plugin-specific analysis — typed as unknown to avoid ts-morph in shared */
  readonly sourceFile: unknown;
}

export interface DiscoveredEdge {
  sourceId: string;
  targetId?: string;
  targetPath?: string;
  type: import('./graph.types.js').RouteEdgeType;
  source: import('./graph.types.js').NavigationSource;
  method?: 'push' | 'replace';
  isExternal: boolean;
  conditions: Condition[];
  loc: SourceLocation;
}

export interface FileAnalysisResult {
  filePath: string;
  edges: DiscoveredEdge[];
  conditions: Condition[];
  tags: string[];
  diagnostics: Diagnostic[];
}

export interface RouteGraphLike {
  hasNode(id: string): boolean;
  getNodePath(id: string): string | undefined;
  findNodeByPath(path: string): string | undefined;
  addNode(id: string, attributes: import('./graph.types.js').NodeAttributes): void;
  addEdge(
    id: string,
    source: string,
    target: string,
    attributes: import('./graph.types.js').EdgeAttributes,
  ): void;
  getAllNodeIds(): string[];
  getAllEdges(): Array<{ id: string; source: string; target: string }>;
}

export interface FrameworkPlugin {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly capabilities: PluginCapabilities;

  detect(ctx: ProjectContext): Promise<boolean>;
  configure(ctx: ProjectContext): Promise<PluginConfig>;
  discoverRoutes(ctx: ProjectContext): AsyncIterable<RawRoute>;
  analyzeFile(file: SemanticFile, ctx: AnalysisContext): Promise<FileAnalysisResult>;
  enrichGraph(graph: RouteGraphLike, ctx: ProjectContext): Promise<void>;
  runDiagnostics(graph: RouteGraphLike): Promise<Diagnostic[]>;
  onFileChange?(event: FileChangeEvent, ctx: ProjectContext): Promise<InvalidationSet>;
}

export interface AnalysisContext extends ProjectContext {
  graph: RouteGraphLike;
  routes: Map<string, RawRoute>;
}

export interface FileChangeEvent {
  type: 'add' | 'change' | 'unlink';
  path: string;
}

export interface InvalidationSet {
  files: string[];
  nodeIds: string[];
}

export interface GraphPatch {
  addedNodes: Array<{ id: string; attributes: import('./graph.types.js').NodeAttributes }>;
  removedNodeIds: string[];
  addedEdges: Array<{
    id: string;
    source: string;
    target: string;
    attributes: import('./graph.types.js').EdgeAttributes;
  }>;
  removedEdgeIds: string[];
  modifiedNodeIds: string[];
}

export interface AnalysisResult {
  graph: RouteGraphLike;
  diagnostics: Diagnostic[];
  metadata: import('./graph.types.js').GraphMetadata;
}

export function defineConfig(config: AnalyzerConfig): AnalyzerConfig {
  return config;
}

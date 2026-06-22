export type RouteNodeType =
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
  | 'api-route'
  | 'redirect'
  | 'rewrite'
  | 'external-url';

export type RouteEdgeType =
  | 'navigation'
  | 'redirect'
  | 'permanent-redirect'
  | 'rewrite'
  | 'import'
  | 'layout-parent'
  | 'template-parent'
  | 'conditional-navigation'
  | 'middleware-match'
  | 'api-call'
  | 'prefetch'
  | 'intercepted-by'
  | 'dependency';

export type ConditionKind =
  | 'auth'
  | 'role'
  | 'permission'
  | 'feature-flag'
  | 'subscription'
  | 'locale'
  | 'env'
  | 'cookie'
  | 'header'
  | 'search-param'
  | 'query-param'
  | 'unknown';

export type ConditionConfidence = 'certain' | 'inferred' | 'heuristic';

export interface SourceLocation {
  filePath: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
}

export interface Condition {
  kind: ConditionKind;
  expression: string;
  negated: boolean;
  confidence: ConditionConfidence;
}

export type DiagnosticSeverity = 'error' | 'warning' | 'info';

export type DiagnosticRuleId =
  | 'dead-route'
  | 'dead-layout'
  | 'broken-link'
  | 'broken-redirect'
  | 'redirect-cycle'
  | 'circular-navigation'
  | 'shadowed-route'
  | 'duplicate-route'
  | 'impossible-route'
  | 'middleware-gap'
  | 'missing-error-boundary'
  | 'missing-loading'
  | 'open-redirect';

export interface Diagnostic {
  ruleId: DiagnosticRuleId | string;
  severity: DiagnosticSeverity;
  message: string;
  loc?: SourceLocation;
  nodeId?: string;
  edgeId?: string;
}

export type NavigationSource =
  | 'Link'
  | 'router.push'
  | 'router.replace'
  | 'router.prefetch'
  | 'router.back'
  | 'router.forward'
  | 'redirect'
  | 'permanentRedirect'
  | 'NextResponse.redirect'
  | 'NextResponse.rewrite'
  | 'window.location'
  | 'window.open'
  | 'history.pushState'
  | 'history.replaceState'
  | 'Navigate'
  | 'custom'
  | 'unknown';

export type RuntimeKind = 'nodejs' | 'edge' | 'browser';
export type RenderingKind = 'static' | 'dynamic' | 'isr' | 'streaming';

export interface NodeAttributes {
  type: RouteNodeType;
  path: string;
  filePath: string;
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
  runtime: RuntimeKind;
  rendering: RenderingKind;
  isClientComponent: boolean;
  isServerComponent: boolean;
  isReachable: boolean;
  isDead: boolean;
  depth: number;
  tags: string[];
  conditions: Condition[];
  diagnostics: Diagnostic[];
  loc: SourceLocation;
}

export interface EdgeAttributes {
  type: RouteEdgeType;
  method?: 'push' | 'replace';
  isExternal: boolean;
  source: NavigationSource;
  conditions: Condition[];
  loc: SourceLocation;
  diagnostics: Diagnostic[];
}

export interface SerializedNode {
  id: string;
  attributes: NodeAttributes;
}

export interface SerializedEdge {
  id: string;
  source: string;
  target: string;
  attributes: EdgeAttributes;
}

export interface SerializedGraph {
  version: '1.0';
  generatedAt: string;
  root: string;
  nodes: SerializedNode[];
  edges: SerializedEdge[];
  metadata?: GraphMetadata;
}

export interface GraphMetadata {
  pluginIds: string[];
  totalRoutes: number;
  totalLayouts: number;
  totalApiRoutes: number;
  deadRouteCount: number;
  cycleCount: number;
  maintainabilityScore?: number;
  riskScore?: number;
}

export function createDefaultNodeAttributes(
  overrides: Partial<NodeAttributes> & Pick<NodeAttributes, 'type' | 'path' | 'filePath'>,
): NodeAttributes {
  return {
    segment: '',
    isDynamic: false,
    isCatchAll: false,
    isOptionalCatchAll: false,
    isParallelSlot: false,
    isIntercepted: false,
    isRouteGroup: false,
    runtime: 'nodejs',
    rendering: 'static',
    isClientComponent: false,
    isServerComponent: true,
    isReachable: false,
    isDead: false,
    depth: 0,
    tags: [],
    conditions: [],
    diagnostics: [],
    loc: { filePath: overrides.filePath, line: 1, column: 1 },
    ...overrides,
  };
}

export function createDefaultEdgeAttributes(
  overrides: Partial<EdgeAttributes> & Pick<EdgeAttributes, 'type' | 'source'>,
): EdgeAttributes {
  return {
    isExternal: false,
    conditions: [],
    loc: { filePath: '', line: 0, column: 0 },
    diagnostics: [],
    ...overrides,
  };
}

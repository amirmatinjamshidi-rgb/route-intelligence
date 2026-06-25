import type { Condition, RouteGraphLike } from '@route-intelligence/shared';
import { createDefaultEdgeAttributes } from '@route-intelligence/shared';
import picomatch from 'picomatch';
import { Node, type SourceFile } from 'ts-morph';

export interface MiddlewareAnalysis {
  matchers: string[];
  redirects: Array<{ path: string; conditions: Condition[] }>;
  rewrites: Array<{ path: string; conditions: Condition[] }>;
  conditions: Condition[];
}

export function analyzeMiddlewareFile(
  sourceFile: SourceFile,
  filePath: string,
): MiddlewareAnalysis {
  const matchers: string[] = [];
  const redirects: Array<{ path: string; conditions: Condition[] }> = [];
  const rewrites: Array<{ path: string; conditions: Condition[] }> = [];
  const conditions: Condition[] = [];

  sourceFile.forEachDescendant((node) => {
    if (Node.isPropertyAssignment(node) && node.getName() === 'matcher') {
      const init = node.getInitializer();
      if (init && Node.isArrayLiteralExpression(init)) {
        for (const el of init.getElements()) {
          if (Node.isStringLiteral(el)) {
            matchers.push(el.getLiteralText());
          }
        }
      } else if (init && Node.isStringLiteral(init)) {
        matchers.push(init.getLiteralText());
      }
    }

    if (Node.isCallExpression(node)) {
      const expr = node.getExpression();
      if (Node.isPropertyAccessExpression(expr)) {
        const obj = expr.getExpression().getText();
        const method = expr.getName();

        if (obj === 'NextResponse' && (method === 'redirect' || method === 'rewrite')) {
          const args = node.getArguments();
          const pathArg = args[0];
          if (pathArg && Node.isStringLiteral(pathArg)) {
            const path = pathArg.getLiteralText();
            const conds = extractSurroundingConditions(node);
            if (method === 'redirect') {
              redirects.push({ path, conditions: conds });
            } else {
              rewrites.push({ path, conditions: conds });
            }
          }
        }
      }
    }

    if (Node.isCallExpression(node)) {
      const callee = node.getExpression().getText();
      if (callee.includes('cookies') || callee.includes('headers')) {
        conditions.push({
          kind: callee.includes('cookies') ? 'cookie' : 'header',
          expression: node.getText(),
          negated: false,
          confidence: 'inferred',
        });
      }
    }
  });

  if (matchers.length === 0) {
    matchers.push('/:path*');
  }

  return { matchers, redirects, rewrites, conditions };
}

function extractSurroundingConditions(node: Node): Condition[] {
  let current: Node | undefined = node;
  const conditions: Condition[] = [];

  while (current) {
    const parent = current.getParent();
    if (!parent) break;

    if (Node.isIfStatement(parent)) {
      conditions.push({
        kind: inferKind(parent.getExpression().getText()),
        expression: parent.getExpression().getText(),
        negated: false,
        confidence: 'inferred',
      });
    }
    current = parent;
  }

  return conditions;
}

function inferKind(expr: string): Condition['kind'] {
  const lower = expr.toLowerCase();
  if (lower.includes('jwt') || lower.includes('token')) return 'auth';
  if (lower.includes('role')) return 'role';
  if (lower.includes('permission')) return 'permission';
  return 'unknown';
}

export function applyMiddlewareToGraph(
  graph: RouteGraphLike,
  middlewareId: string,
  analysis: MiddlewareAnalysis,
): void {
  for (const matcher of analysis.matchers) {
    const isMatch = picomatch(matcher);

    for (const nodeId of graph.getAllNodeIds()) {
      const path = graph.getNodePath(nodeId);
      if (!path || nodeId === middlewareId) continue;

      if (isMatch(path) || matcher === '/:path*') {
        graph.addEdge(
          `middleware-match:${middlewareId}->${nodeId}:${matcher}`,
          middlewareId,
          nodeId,
          createDefaultEdgeAttributes({
            type: 'middleware-match',
            source: 'unknown',
            conditions: analysis.conditions,
          }),
        );
      }
    }
  }

  for (const redirect of analysis.redirects) {
    const targetId = graph.findNodeByPath(redirect.path);
    if (targetId) {
      graph.addEdge(
        `middleware-redirect:${middlewareId}->${targetId}`,
        middlewareId,
        targetId,
        createDefaultEdgeAttributes({
          type: 'redirect',
          source: 'NextResponse.redirect',
          conditions: redirect.conditions,
        }),
      );
    }
  }

  for (const rewrite of analysis.rewrites) {
    const targetId = graph.findNodeByPath(rewrite.path);
    if (targetId) {
      graph.addEdge(
        `middleware-rewrite:${middlewareId}->${targetId}`,
        middlewareId,
        targetId,
        createDefaultEdgeAttributes({
          type: 'rewrite',
          source: 'NextResponse.rewrite',
          conditions: rewrite.conditions,
        }),
      );
    }
  }
}

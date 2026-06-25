import type { Condition, NavigationDestination, SourceLocation } from '@route-intelligence/shared';
import type { NavigationCall } from '@route-intelligence/shared';
import {
  type CallExpression,
  type Expression,
  type JsxAttribute,
  Node,
  type SourceFile,
  SyntaxKind,
} from 'ts-morph';

function toLoc(node: Node, filePath: string): SourceLocation {
  const start = node.getStartLineNumber();
  const col = node.getStart() - node.getSourceFile().getLineAndColumnAtPos(node.getStart()).column;
  return {
    filePath,
    line: start,
    column: node.getStartLineNumber() > 0 ? 1 : 0,
  };
}

export function resolveDestination(expr: Expression | undefined): NavigationDestination {
  if (!expr) return { kind: 'dynamic', expression: 'unknown' };

  if (Node.isStringLiteral(expr) || Node.isNoSubstitutionTemplateLiteral(expr)) {
    const path = expr.getLiteralText();
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return { kind: 'external', url: path };
    }
    return { kind: 'static', path };
  }

  if (Node.isTemplateExpression(expr)) {
    const head = expr.getHead().getLiteralText();
    const spans = expr.getTemplateSpans();
    const params: string[] = [];
    let template = head;
    for (const span of spans) {
      const paramExpr = span.getExpression();
      params.push(paramExpr.getText());
      template += `\${${paramExpr.getText()}}`;
      template += span.getLiteral().getLiteralText();
    }
    return { kind: 'template-literal', template, params };
  }

  return { kind: 'dynamic', expression: expr.getText() };
}

const NAVIGATION_CALLEES = new Set([
  'redirect',
  'permanentRedirect',
  'push',
  'replace',
  'prefetch',
  'back',
  'forward',
]);

const ROUTER_METHODS = new Set(['push', 'replace', 'prefetch', 'back', 'forward']);

function getCalleeName(call: CallExpression): string {
  const expr = call.getExpression();

  if (Node.isIdentifier(expr)) {
    return expr.getText();
  }

  if (Node.isPropertyAccessExpression(expr)) {
    const obj = expr.getExpression().getText();
    const name = expr.getName();
    if (obj === 'router' || obj.endsWith('Router')) {
      return `router.${name}`;
    }
    if (obj === 'NextResponse') {
      return `NextResponse.${name}`;
    }
    if (obj === 'history') {
      return `history.${name}`;
    }
    if (obj === 'window.location') {
      return 'window.location';
    }
    return `${obj}.${name}`;
  }

  return expr.getText();
}

function extractConditionsFromNode(node: Node): Condition[] {
  let current: Node | undefined = node;
  const conditions: Condition[] = [];

  while (current) {
    const parent = current.getParent();
    if (!parent) break;

    if (Node.isIfStatement(parent)) {
      conditions.push({
        kind: inferConditionKind(parent.getExpression().getText()),
        expression: parent.getExpression().getText(),
        negated: parent.getElseStatement() === current,
        confidence: 'inferred',
      });
    }

    if (Node.isConditionalExpression(parent)) {
      conditions.push({
        kind: 'unknown',
        expression: parent.getCondition().getText(),
        negated: parent.getWhenFalse() === current,
        confidence: 'inferred',
      });
    }

    current = parent;
  }

  return conditions;
}

function inferConditionKind(expression: string): Condition['kind'] {
  const lower = expression.toLowerCase();
  if (lower.includes('auth') || lower.includes('session') || lower.includes('loggedin')) {
    return 'auth';
  }
  if (lower.includes('role')) return 'role';
  if (lower.includes('permission')) return 'permission';
  if (lower.includes('feature') || lower.includes('flag')) return 'feature-flag';
  if (lower.includes('cookie')) return 'cookie';
  if (lower.includes('header')) return 'header';
  if (lower.includes('locale') || lower.includes('lang')) return 'locale';
  if (lower.includes('process.env')) return 'env';
  if (lower.includes('searchparams') || lower.includes('query')) return 'search-param';
  return 'unknown';
}

export function extractNavigationCalls(
  sourceFile: SourceFile,
  filePath: string,
  customWrappers: string[] = [],
): NavigationCall[] {
  const calls: NavigationCall[] = [];

  sourceFile.forEachDescendant((node) => {
    if (!Node.isCallExpression(node)) return;

    const callee = getCalleeName(node);
    const calleeBase = callee.split('.').pop() ?? callee;

    const isNavCall =
      NAVIGATION_CALLEES.has(calleeBase) ||
      callee.startsWith('router.') ||
      callee.startsWith('NextResponse.') ||
      callee.startsWith('history.') ||
      customWrappers.some((w) => callee.includes(w));

    if (!isNavCall) return;

    const args = node.getArguments();
    let destination: NavigationDestination = { kind: 'dynamic', expression: 'unknown' };
    let method: 'push' | 'replace' | undefined;

    if (calleeBase === 'back' || calleeBase === 'forward') {
      destination = { kind: 'dynamic', expression: calleeBase };
    } else if (args[0] && Node.isExpression(args[0])) {
      destination = resolveDestination(args[0]);
    }

    if (calleeBase === 'replace' || callee.includes('permanentRedirect')) {
      method = 'replace';
    } else if (calleeBase === 'push') {
      method = 'push';
    }

    calls.push({
      callee,
      destination,
      method,
      conditions: extractConditionsFromNode(node),
      loc: toLoc(node, filePath),
    });
  });

  return calls;
}

export function extractJsxLinks(
  sourceFile: SourceFile,
  filePath: string,
): Array<{
  componentName: string;
  destination: NavigationDestination;
  prefetch?: boolean;
  conditions: Condition[];
  loc: SourceLocation;
}> {
  const links: Array<{
    componentName: string;
    destination: NavigationDestination;
    prefetch?: boolean;
    conditions: Condition[];
    loc: SourceLocation;
  }> = [];

  sourceFile.forEachDescendant((node) => {
    if (!Node.isJsxOpeningElement(node) && !Node.isJsxSelfClosingElement(node)) return;

    const tagName = Node.isJsxOpeningElement(node)
      ? node.getTagNameNode().getText()
      : node.getTagNameNode().getText();

    if (tagName !== 'Link' && !tagName.endsWith('.Link')) return;

    const hrefAttr = node.getAttribute('href') as JsxAttribute | undefined;
    if (!hrefAttr) return;

    const initializer = hrefAttr.getInitializer();
    let destination: NavigationDestination = { kind: 'dynamic', expression: 'unknown' };

    if (initializer && Node.isJsxExpression(initializer)) {
      const expr = initializer.getExpression();
      if (expr) destination = resolveDestination(expr);
    } else if (initializer && Node.isStringLiteral(initializer)) {
      destination = resolveDestination(initializer);
    }

    const prefetchAttr = node.getAttribute('prefetch');
    let prefetch: boolean | undefined;
    if (prefetchAttr && Node.isJsxAttribute(prefetchAttr)) {
      const init = prefetchAttr.getInitializer();
      if (init && Node.isStringLiteral(init)) {
        prefetch = init.getLiteralText() !== 'false';
      } else {
        prefetch = true;
      }
    }

    links.push({
      componentName: tagName,
      destination,
      prefetch,
      conditions: extractConditionsFromNode(node),
      loc: toLoc(node, filePath),
    });
  });

  return links;
}

export function extractWindowLocationAssignments(
  sourceFile: SourceFile,
  filePath: string,
): NavigationCall[] {
  const calls: NavigationCall[] = [];

  sourceFile.forEachDescendant((node) => {
    if (!Node.isBinaryExpression(node)) return;
    if (node.getOperatorToken().getKind() !== SyntaxKind.EqualsToken) return;

    const left = node.getLeft().getText();
    if (!left.includes('window.location') && !left.includes('location.href')) return;

    calls.push({
      callee: 'window.location',
      destination: resolveDestination(node.getRight()),
      method: 'replace',
      conditions: extractConditionsFromNode(node),
      loc: toLoc(node, filePath),
    });
  });

  return calls;
}

export function extractWindowOpenCalls(sourceFile: SourceFile, filePath: string): NavigationCall[] {
  const calls: NavigationCall[] = [];

  sourceFile.forEachDescendant((node) => {
    if (!Node.isCallExpression(node)) return;
    const callee = getCalleeName(node);
    if (callee !== 'window.open' && callee !== 'open') return;

    const args = node.getArguments();
    calls.push({
      callee: 'window.open',
      destination:
        args[0] && Node.isExpression(args[0])
          ? resolveDestination(args[0])
          : { kind: 'dynamic', expression: 'unknown' },
      conditions: extractConditionsFromNode(node),
      loc: toLoc(node, filePath),
    });
  });

  return calls;
}

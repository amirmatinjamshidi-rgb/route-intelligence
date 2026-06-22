import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ESLint, Rule } from 'eslint';
import type { SerializedGraph } from '@route-intelligence/shared';
import type { JSXAttribute, CallExpression, Program } from 'estree-jsx';

function loadGraph(cwd: string): SerializedGraph | null {
  const paths = [
    join(cwd, 'ri-output', 'graph.json'),
    join(cwd, '.route-intelligence', 'graph.json'),
  ];
  for (const p of paths) {
    if (existsSync(p)) {
      return JSON.parse(readFileSync(p, 'utf-8')) as SerializedGraph;
    }
  }
  return null;
}

function getKnownPaths(graph: SerializedGraph): Set<string> {
  return new Set(
    graph.nodes.filter((n) => n.attributes.type === 'route').map((n) => n.attributes.path),
  );
}

const noBrokenRoute: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow links to non-existent routes' },
    schema: [],
    messages: { broken: 'Route "{{path}}" does not exist in the routing graph' },
  },
  create(context) {
    const graph = loadGraph(context.cwd);
    if (!graph) return {};
    const paths = getKnownPaths(graph);

    return {
      JSXAttribute(node: JSXAttribute) {
        if (node.name.type !== 'JSXIdentifier' || node.name.name !== 'href') return;
        const value = node.value;
        if (!value || value.type !== 'Literal' || typeof value.value !== 'string') return;
        const path = value.value;
        if (path.startsWith('http') || path.startsWith('#')) return;
        if (!paths.has(path) && !paths.has(path.replace(/\/$/, ''))) {
          context.report({ node, messageId: 'broken', data: { path } });
        }
      },
    };
  },
};

const noInvalidRedirect: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow redirects to non-existent routes' },
    schema: [],
    messages: { invalid: 'Redirect target "{{path}}" does not exist' },
  },
  create(context) {
    const graph = loadGraph(context.cwd);
    if (!graph) return {};
    const paths = getKnownPaths(graph);

    return {
      CallExpression(node: CallExpression) {
        if (node.callee.type !== 'Identifier') return;
        if (node.callee.name !== 'redirect' && node.callee.name !== 'permanentRedirect') return;
        const arg = node.arguments[0];
        if (!arg || arg.type !== 'Literal' || typeof arg.value !== 'string') return;
        if (!paths.has(arg.value)) {
          context.report({ node, messageId: 'invalid', data: { path: arg.value } });
        }
      },
    };
  },
};

const noDeadPage: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Warn when current file is a dead route' },
    schema: [],
    messages: { dead: 'This page appears to be unreachable (dead route)' },
  },
  create(context) {
    const graph = loadGraph(context.cwd);
    if (!graph) return {};
    const filename = context.filename.replace(/\\/g, '/');

    const deadNode = graph.nodes.find(
      (n) => n.attributes.isDead && n.attributes.filePath.replace(/\\/g, '/').includes(filename),
    );

    if (deadNode) {
      return {
        Program(node: Program) {
          context.report({ node, messageId: 'dead' });
        },
      };
    }
    return {};
  },
};

const preferRouteConstants: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Prefer route constants over string literals' },
    schema: [],
    messages: { prefer: 'Use a route constant instead of inline string "{{path}}"' },
  },
  create(context) {
    return {
      JSXAttribute(node: JSXAttribute) {
        if (node.name.type !== 'JSXIdentifier' || node.name.name !== 'href') return;
        const value = node.value;
        if (!value || value.type !== 'Literal' || typeof value.value !== 'string') return;
        if (value.value.startsWith('/')) {
          context.report({ node, messageId: 'prefer', data: { path: value.value } });
        }
      },
    };
  },
};

const detectRouteCycles: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Detect navigation that creates cycles' },
    schema: [],
    messages: { cycle: 'Navigation may create a route cycle' },
  },
  create(context) {
    const graph = loadGraph(context.cwd);
    if (!graph) return {};

    const edges = new Map<string, Set<string>>();
    for (const edge of graph.edges) {
      if (edge.attributes.type === 'navigation' || edge.attributes.type === 'conditional-navigation') {
        const set = edges.get(edge.source) ?? new Set();
        set.add(edge.target);
        edges.set(edge.source, set);
      }
    }

    return {
      CallExpression(node: CallExpression) {
        if (node.callee.type !== 'Identifier' && node.callee.type !== 'MemberExpression') return;
        const text =
          node.callee.type === 'Identifier'
            ? node.callee.name
            : node.callee.type === 'MemberExpression' && node.callee.property.type === 'Identifier'
              ? node.callee.property.name
              : '';
        if (!['push', 'navigate', 'redirect'].includes(text)) return;

        const filename = context.filename;
        const sourceNode = graph.nodes.find((n) => n.attributes.filePath.includes(filename.split(/[/\\]/).pop() ?? ''));
        if (!sourceNode) return;

        const targets = edges.get(sourceNode.id);
        if (targets?.has(sourceNode.id)) {
          context.report({ node, messageId: 'cycle' });
        }
      },
    };
  },
};

const plugin: ESLint.Plugin = {
  meta: { name: 'eslint-plugin-route-intelligence', version: '0.1.0' },
  rules: {
    'no-broken-route': noBrokenRoute,
    'no-invalid-redirect': noInvalidRedirect,
    'no-dead-page': noDeadPage,
    'prefer-route-constants': preferRouteConstants,
    'detect-route-cycles': detectRouteCycles,
  },
};

export default plugin;
export { noBrokenRoute, noInvalidRedirect, noDeadPage, preferRouteConstants, detectRouteCycles };

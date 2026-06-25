import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { type RouteGraph, createAnalyzer, exportJson } from '@route-intelligence/core';
import { NextPlugin } from '@route-intelligence/next';
import type { SerializedGraph } from '@route-intelligence/shared';

export interface GraphDiff {
  addedRoutes: string[];
  removedRoutes: string[];
  modifiedConditions: string[];
  newBrokenLinks: number;
  newDeadRoutes: number;
  newRedirectCycles: number;
  riskScoreDelta: number;
}

export function diffGraphs(before: SerializedGraph, after: SerializedGraph): GraphDiff {
  const beforeRoutes = new Map(
    before.nodes.filter((n) => n.attributes.type === 'route').map((n) => [n.attributes.path, n]),
  );
  const afterRoutes = new Map(
    after.nodes.filter((n) => n.attributes.type === 'route').map((n) => [n.attributes.path, n]),
  );

  const addedRoutes = [...afterRoutes.keys()].filter((p) => !beforeRoutes.has(p));
  const removedRoutes = [...beforeRoutes.keys()].filter((p) => !afterRoutes.has(p));

  const modifiedConditions: string[] = [];
  for (const [path, afterNode] of afterRoutes) {
    const beforeNode = beforeRoutes.get(path);
    if (!beforeNode) continue;
    if (
      JSON.stringify(beforeNode.attributes.conditions) !==
      JSON.stringify(afterNode.attributes.conditions)
    ) {
      modifiedConditions.push(path);
    }
  }

  const beforeBroken = before.edges.filter((e) =>
    e.attributes.diagnostics?.some((d) => d.ruleId === 'broken-link'),
  ).length;
  const afterBroken = after.edges.filter((e) =>
    e.attributes.diagnostics?.some((d) => d.ruleId === 'broken-link'),
  ).length;

  const beforeDead = before.nodes.filter((n) => n.attributes.isDead).length;
  const afterDead = after.nodes.filter((n) => n.attributes.isDead).length;

  return {
    addedRoutes,
    removedRoutes,
    modifiedConditions,
    newBrokenLinks: afterBroken - beforeBroken,
    newDeadRoutes: afterDead - beforeDead,
    newRedirectCycles: (after.metadata?.cycleCount ?? 0) - (before.metadata?.cycleCount ?? 0),
    riskScoreDelta: (after.metadata?.riskScore ?? 0) - (before.metadata?.riskScore ?? 0),
  };
}

export function formatPrComment(diff: GraphDiff): string {
  const lines = ['## Route Intelligence Report', ''];

  if (diff.addedRoutes.length > 0) {
    lines.push('### Added Routes', ...diff.addedRoutes.map((r) => `- \`${r}\``), '');
  }
  if (diff.removedRoutes.length > 0) {
    lines.push('### Removed Routes', ...diff.removedRoutes.map((r) => `- \`${r}\``), '');
  }
  if (diff.modifiedConditions.length > 0) {
    lines.push('### Modified Conditions', ...diff.modifiedConditions.map((r) => `- \`${r}\``), '');
  }

  lines.push(
    '### Analysis Summary',
    `- New broken links: ${diff.newBrokenLinks}`,
    `- New dead routes: ${diff.newDeadRoutes}`,
    `- New redirect cycles: ${diff.newRedirectCycles}`,
    `- Risk score delta: ${diff.riskScoreDelta > 0 ? '+' : ''}${diff.riskScoreDelta.toFixed(1)}`,
  );

  return lines.join('\n');
}

async function analyze(root: string): Promise<SerializedGraph> {
  const analyzer = createAnalyzer({
    root,
    plugins: [NextPlugin()],
    include: ['app/**', 'pages/**', 'src/**', 'middleware.ts'],
    exclude: ['**/node_modules/**', '**/.next/**'],
  });
  const result = await analyzer.analyze();
  return JSON.parse(exportJson(result.graph as RouteGraph, root)) as SerializedGraph;
}

async function run(): Promise<void> {
  const root = resolve(process.env.INPUT_ROOT ?? process.env.GITHUB_WORKSPACE ?? '.');
  const failOnError = process.env.INPUT_FAIL_ON_ERROR !== 'false';

  const currentGraph = await analyze(root);
  writeFileSync(resolve(root, 'ri-output', 'graph.json'), JSON.stringify(currentGraph, null, 2));

  const diff: GraphDiff = {
    addedRoutes: currentGraph.nodes
      .filter((n) => n.attributes.type === 'route')
      .map((n) => n.attributes.path),
    removedRoutes: [],
    modifiedConditions: [],
    newBrokenLinks: 0,
    newDeadRoutes: currentGraph.metadata?.deadRouteCount ?? 0,
    newRedirectCycles: currentGraph.metadata?.cycleCount ?? 0,
    riskScoreDelta: 0,
  };

  const comment = formatPrComment(diff);
  writeFileSync(resolve(root, 'ri-output', 'pr-comment.md'), comment);

  console.log(comment);

  if (failOnError && (diff.newBrokenLinks > 0 || diff.newRedirectCycles > 0)) {
    process.exit(1);
  }
}

if (process.env.GITHUB_ACTIONS) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { analyze, run };

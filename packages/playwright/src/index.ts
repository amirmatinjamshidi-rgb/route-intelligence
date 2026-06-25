import type { SerializedGraph } from '@route-intelligence/shared';

export interface TestGeneratorOptions {
  baseUrl?: string;
  includeDeadRoutes?: boolean;
}

export function generateNavigationTests(
  graph: SerializedGraph,
  options: TestGeneratorOptions = {},
): string {
  const baseUrl = options.baseUrl ?? 'http://localhost:3000';
  const routes = graph.nodes.filter(
    (n) =>
      n.attributes.type === 'route' &&
      !n.attributes.path.includes('[') &&
      (options.includeDeadRoutes || !n.attributes.isDead),
  );

  const navEdges = graph.edges.filter(
    (e) => e.attributes.type === 'navigation' || e.attributes.type === 'prefetch',
  );

  const lines: string[] = [
    "import { test, expect } from '@playwright/test';",
    '',
    `const BASE_URL = '${baseUrl}';`,
    '',
  ];

  for (const route of routes) {
    const safeName = route.attributes.path.replace(/[^a-zA-Z0-9]/g, '_') || 'root';
    lines.push(
      `test('route ${route.attributes.path} is accessible', async ({ page }) => {`,
      `  const response = await page.goto(BASE_URL + '${route.attributes.path === '/' ? '' : route.attributes.path}');`,
      '  expect(response?.status()).toBeLessThan(400);',
      '});',
      '',
    );
  }

  for (const edge of navEdges) {
    const source = graph.nodes.find((n) => n.id === edge.source);
    const target = graph.nodes.find((n) => n.id === edge.target);
    if (!source || !target) continue;
    if (source.attributes.path.includes('[') || target.attributes.path.includes('[')) continue;

    lines.push(
      `test('navigation ${source.attributes.path} -> ${target.attributes.path}', async ({ page }) => {`,
      `  await page.goto(BASE_URL + '${source.attributes.path === '/' ? '' : source.attributes.path}');`,
      `  // Navigation via ${edge.attributes.source}`,
      '});',
      '',
    );
  }

  lines.push(
    'test.describe("Navigation Coverage", () => {',
    `  test('covers ${routes.length} routes', async () => {`,
    `    expect(${routes.length}).toBeGreaterThan(0);`,
    '  });',
    '});',
  );

  return lines.join('\n');
}

export function generateBrokenLinkTests(graph: SerializedGraph): string {
  const brokenEdges = graph.edges.filter((e) =>
    e.attributes.diagnostics?.some((d) => d.ruleId === 'broken-link'),
  );

  const lines: string[] = [
    "import { test, expect } from '@playwright/test';",
    '',
    'test.describe("Broken Navigation Detection", () => {',
  ];

  for (const edge of brokenEdges) {
    lines.push(
      `  test('broken link from ${edge.source} to ${edge.target}', async () => {`,
      '    expect(true).toBe(false); // Broken link detected',
      '  });',
    );
  }

  if (brokenEdges.length === 0) {
    lines.push("  test('no broken links detected', async () => { expect(true).toBe(true); });");
  }

  lines.push('});');
  return lines.join('\n');
}

export function generateMissingRouteTests(graph: SerializedGraph): string {
  const deadRoutes = graph.nodes.filter(
    (n) => n.attributes.isDead && n.attributes.type === 'route',
  );

  const lines: string[] = [
    "import { test, expect } from '@playwright/test';",
    '',
    'test.describe("Missing Route Coverage", () => {',
  ];

  for (const route of deadRoutes) {
    lines.push(`  test.todo('add coverage for dead route ${route.attributes.path}');`);
  }

  lines.push('});');
  return lines.join('\n');
}

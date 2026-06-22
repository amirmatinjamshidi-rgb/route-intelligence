import type { RouteGraph } from '../graph/RouteGraph.js';
import { exportMermaid } from './MermaidExporter.js';

export function exportHtml(graph: RouteGraph, root: string): string {
  const json = JSON.stringify(graph.toJSON(root));
  const mermaid = exportMermaid(graph);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Route Intelligence Report</title>
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ startOnLoad: true, theme: 'dark' });
  </script>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 2rem; background: #0a0a0a; color: #fafafa; }
    h1 { margin-bottom: 0.5rem; }
    .meta { color: #888; margin-bottom: 2rem; }
    pre { background: #1a1a1a; padding: 1rem; border-radius: 8px; overflow: auto; }
    .mermaid { background: #1a1a1a; padding: 1rem; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>Route Intelligence Report</h1>
  <p class="meta">Generated from ${root}</p>
  <h2>Route Graph</h2>
  <pre class="mermaid">${escapeHtml(mermaid)}</pre>
  <h2>Graph Data</h2>
  <pre id="graph-data"></pre>
  <script>
    document.getElementById('graph-data').textContent = JSON.stringify(${json}, null, 2);
  </script>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function exportMarkdown(graph: RouteGraph, root: string): string {
  const metadata = graph.toJSON(root).metadata;
  const lines: string[] = [
    '# Route Intelligence Report',
    '',
    `**Root:** \`${root}\``,
    '',
    '## Summary',
    '',
    `- Routes: ${metadata?.totalRoutes ?? 0}`,
    `- Layouts: ${metadata?.totalLayouts ?? 0}`,
    `- API Routes: ${metadata?.totalApiRoutes ?? 0}`,
    `- Dead Routes: ${metadata?.deadRouteCount ?? 0}`,
    `- Cycles: ${metadata?.cycleCount ?? 0}`,
    '',
    '## Routes',
    '',
  ];

  for (const nodeId of graph.getAllNodeIds()) {
    const node = graph.getNode(nodeId);
    if (!node || node.type !== 'route') continue;
    lines.push(`- \`${node.path}\` — ${node.filePath}${node.isDead ? ' *(dead)*' : ''}`);
  }

  lines.push('', '## Mermaid Diagram', '', '```mermaid', exportMermaid(graph), '```');
  return lines.join('\n');
}

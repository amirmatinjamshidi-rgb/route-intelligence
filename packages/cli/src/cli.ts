#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import {
  createAnalyzer,
  exportDot,
  exportHtml,
  exportJson,
  exportMarkdown,
  exportMermaid,
  exportPlantUML,
  type RouteGraph,
} from '@route-intelligence/core';
import { NextPlugin } from '@route-intelligence/next';
import type { AnalyzerConfig } from '@route-intelligence/shared';
import chalk from 'chalk';
import { Command } from 'commander';
import ora from 'ora';

const program = new Command();

program
  .name('route-intelligence')
  .description('Routing intelligence platform for React applications')
  .version('0.1.0');

function getDefaultConfig(root: string): AnalyzerConfig {
  return {
    root,
    plugins: [NextPlugin()],
    include: ['app/**', 'pages/**', 'src/**', 'middleware.ts'],
    exclude: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/*.test.*', '**/*.spec.*'],
    cache: { enabled: true, directory: '.route-intelligence' },
    output: { formats: ['json', 'mermaid'], directory: 'ri-output' },
  };
}

async function runAnalysis(root: string) {
  const spinner = ora('Analyzing routes...').start();
  const config = getDefaultConfig(resolve(root));
  const analyzer = createAnalyzer(config);
  const result = await analyzer.analyze();
  const graph = result.graph as RouteGraph;
  spinner.succeed(
    chalk.green(
      `Found ${result.metadata.totalRoutes} routes, ${result.metadata.totalLayouts} layouts`,
    ),
  );
  return { ...result, graph };
}

program
  .command('analyze')
  .description('Analyze project routing')
  .option('-r, --root <path>', 'Project root', '.')
  .option('-f, --format <format>', 'Output format (json|mermaid|plantuml|dot|html|markdown)', 'json')
  .option('-o, --out <path>', 'Output directory', 'ri-output')
  .action(async (opts: { root: string; format: string; out: string }) => {
    const result = await runAnalysis(opts.root);
    const outDir = resolve(opts.root, opts.out);
    mkdirSync(outDir, { recursive: true });

    const exporters: Record<string, () => string> = {
      json: () => exportJson(result.graph, resolve(opts.root)),
      mermaid: () => exportMermaid(result.graph),
      plantuml: () => exportPlantUML(result.graph),
      dot: () => exportDot(result.graph),
      html: () => exportHtml(result.graph, resolve(opts.root)),
      markdown: () => exportMarkdown(result.graph, resolve(opts.root)),
    };

    const exporter = exporters[opts.format];
    if (!exporter) {
      console.error(chalk.red(`Unknown format: ${opts.format}`));
      process.exit(1);
    }

    const ext = opts.format === 'json' ? 'json' : opts.format === 'markdown' ? 'md' : opts.format;
    const outPath = join(outDir, `graph.${ext}`);
    writeFileSync(outPath, exporter());
    console.log(chalk.blue(`Written to ${outPath}`));

    if (result.diagnostics.length > 0) {
      console.log(chalk.yellow(`\n${result.diagnostics.length} diagnostics:`));
      for (const d of result.diagnostics.slice(0, 10)) {
        console.log(`  [${d.severity}] ${d.ruleId}: ${d.message}`);
      }
    }
  });

program
  .command('graph')
  .description('Launch interactive graph browser')
  .option('-r, --root <path>', 'Project root', '.')
  .option('-p, --port <port>', 'Port', '3001')
  .option('--host <host>', 'Host', 'localhost')
  .action(async (opts: { root: string; port: string; host: string }) => {
    const result = await runAnalysis(opts.root);
    const outDir = resolve(opts.root, 'ri-output');
    mkdirSync(outDir, { recursive: true });
    const graphJson = exportJson(result.graph, resolve(opts.root));
    writeFileSync(join(outDir, 'graph.json'), graphJson);

    const port = Number.parseInt(opts.port, 10);
    const server = createServer((req, res) => {
      if (req.url === '/' || req.url === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(getVisualizerHtml());
      } else if (req.url === '/graph.json') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(graphJson);
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(port, opts.host, () => {
      console.log(chalk.green(`Graph server running at http://${opts.host}:${port}`));
    });
  });

program
  .command('doctor')
  .description('Run static analysis health check')
  .option('-r, --root <path>', 'Project root', '.')
  .option('--strict', 'Exit with error on warnings')
  .option('-f, --format <format>', 'Output format (text|json)', 'text')
  .action(async (opts: { root: string; strict?: boolean; format: string }) => {
    const result = await runAnalysis(opts.root);
    const errors = result.diagnostics.filter((d) => d.severity === 'error');
    const warnings = result.diagnostics.filter((d) => d.severity === 'warning');

    if (opts.format === 'json') {
      console.log(JSON.stringify(result.diagnostics, null, 2));
    } else {
      console.log(chalk.bold('\nRoute Intelligence Doctor\n'));
      console.log(`Errors: ${errors.length}, Warnings: ${warnings.length}\n`);
      for (const d of result.diagnostics) {
        const color = d.severity === 'error' ? chalk.red : chalk.yellow;
        console.log(color(`[${d.severity}] ${d.ruleId}: ${d.message}`));
      }
    }

    if (errors.length > 0 || (opts.strict && warnings.length > 0)) {
      process.exit(1);
    }
  });

program
  .command('docs')
  .description('Generate route documentation')
  .option('-r, --root <path>', 'Project root', '.')
  .option('-f, --format <format>', 'Format (markdown|html)', 'markdown')
  .option('-o, --out <path>', 'Output directory', 'docs/routes')
  .action(async (opts: { root: string; format: string; out: string }) => {
    const result = await runAnalysis(opts.root);
    const outDir = resolve(opts.root, opts.out);
    mkdirSync(outDir, { recursive: true });

    const content =
      opts.format === 'html'
        ? exportHtml(result.graph, resolve(opts.root))
        : exportMarkdown(result.graph, resolve(opts.root));

    const ext = opts.format === 'html' ? 'html' : 'md';
    writeFileSync(join(outDir, `routes.${ext}`), content);
    console.log(chalk.green(`Documentation written to ${outDir}/routes.${ext}`));
  });

program
  .command('export')
  .description('Export route graph')
  .option('-r, --root <path>', 'Project root', '.')
  .option('-f, --format <format>', 'Format', 'json')
  .option('-o, --out <path>', 'Output directory', 'ri-export')
  .action(async (opts: { root: string; format: string; out: string }) => {
    const result = await runAnalysis(opts.root);
    const outDir = resolve(opts.root, opts.out);
    mkdirSync(outDir, { recursive: true });

    const exporters: Record<string, () => string> = {
      json: () => exportJson(result.graph, resolve(opts.root)),
      mermaid: () => exportMermaid(result.graph),
      plantuml: () => exportPlantUML(result.graph),
      dot: () => exportDot(result.graph),
    };

    const content = exporters[opts.format]?.() ?? exportJson(result.graph, resolve(opts.root));
    writeFileSync(join(outDir, `graph.${opts.format}`), content);
    console.log(chalk.green(`Exported to ${outDir}/graph.${opts.format}`));
  });

program
  .command('watch')
  .description('Watch for changes and incrementally update graph')
  .option('-r, --root <path>', 'Project root', '.')
  .option('-p, --port <port>', 'Graph server port', '3001')
  .action(async (opts: { root: string; port: string }) => {
    const config = getDefaultConfig(resolve(opts.root));
    const analyzer = createAnalyzer(config);
    const watcher = analyzer.watch();

    watcher.on('update', (patch) => {
      console.log(
        chalk.blue(
          `Graph updated: +${patch.addedNodes.length} nodes, -${patch.removedNodeIds.length} nodes`,
        ),
      );
    });

    watcher.on('error', (err) => {
      console.error(chalk.red(err.message));
    });

    console.log(chalk.green('Watching for route changes...'));
    process.on('SIGINT', async () => {
      await watcher.stop();
      process.exit(0);
    });
  });

function getVisualizerHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Route Intelligence Graph</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #0a0a0a; color: #fafafa; height: 100vh; display: flex; flex-direction: column; }
    header { padding: 1rem; border-bottom: 1px solid #333; display: flex; gap: 1rem; align-items: center; }
    input { flex: 1; padding: 0.5rem; background: #1a1a1a; border: 1px solid #333; color: #fff; border-radius: 4px; }
    #graph { flex: 1; overflow: auto; padding: 1rem; }
    .node { background: #1e3a5f; border: 1px solid #3b82f6; border-radius: 8px; padding: 0.75rem; margin: 0.5rem; display: inline-block; cursor: pointer; }
    .node.dead { border-color: #ef4444; opacity: 0.7; }
    .node-type { font-size: 0.75rem; color: #888; }
    .node-path { font-weight: 600; }
    #detail { position: fixed; right: 0; top: 0; width: 300px; height: 100%; background: #111; border-left: 1px solid #333; padding: 1rem; overflow: auto; transform: translateX(100%); transition: transform 0.2s; }
    #detail.open { transform: translateX(0); }
    .overlay-toggle { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .overlay-toggle label { font-size: 0.875rem; }
  </style>
</head>
<body>
  <header>
    <h1>Route Intelligence</h1>
    <input type="search" id="search" placeholder="Search routes...">
    <div class="overlay-toggle">
      <label><input type="checkbox" id="show-dead"> Dead</label>
      <label><input type="checkbox" id="show-api" checked> API</label>
      <label><input type="checkbox" id="show-dynamic" checked> Dynamic</label>
    </div>
  </header>
  <div id="graph"></div>
  <div id="detail"></div>
  <script>
    let graphData = null;
    fetch('/graph.json').then(r => r.json()).then(data => { graphData = data; render(); });
    function render() {
      const container = document.getElementById('graph');
      const search = document.getElementById('search').value.toLowerCase();
      const showDead = document.getElementById('show-dead').checked;
      container.innerHTML = '';
      for (const node of graphData.nodes) {
        if (node.attributes.type !== 'route' && node.attributes.type !== 'layout' && node.attributes.type !== 'api-route') continue;
        if (!showDead && node.attributes.isDead) continue;
        if (search && !node.attributes.path.toLowerCase().includes(search)) continue;
        const el = document.createElement('div');
        el.className = 'node' + (node.attributes.isDead ? ' dead' : '');
        el.innerHTML = '<div class="node-type">' + node.attributes.type + '</div><div class="node-path">' + node.attributes.path + '</div>';
        el.onclick = () => showDetail(node);
        container.appendChild(el);
      }
    }
    function showDetail(node) {
      const detail = document.getElementById('detail');
      detail.className = 'open';
      detail.innerHTML = '<h2>' + node.attributes.path + '</h2><p>Type: ' + node.attributes.type + '</p><p>File: ' + node.attributes.filePath + '</p><p>Depth: ' + node.attributes.depth + '</p>';
    }
    document.getElementById('search').oninput = render;
    document.getElementById('show-dead').onchange = render;
  </script>
</body>
</html>`;
}

program.parse();

import { type RouteGraph, createAnalyzer, exportJson } from '@route-intelligence/core';
import { NextPlugin } from '@route-intelligence/next';
import type { SerializedGraph } from '@route-intelligence/shared';
import * as vscode from 'vscode';

let cachedGraph: SerializedGraph | null = null;
const diagnosticCollection = vscode.languages.createDiagnosticCollection('route-intelligence');

async function analyzeWorkspace(): Promise<SerializedGraph | null> {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceRoot) return null;

  const analyzer = createAnalyzer({
    root: workspaceRoot,
    plugins: [NextPlugin()],
    include: ['app/**', 'pages/**', 'src/**', 'middleware.ts'],
    exclude: ['**/node_modules/**', '**/.next/**'],
  });

  const result = await analyzer.analyze();
  cachedGraph = JSON.parse(
    exportJson(result.graph as RouteGraph, workspaceRoot),
  ) as SerializedGraph;

  updateDiagnostics(result.diagnostics);
  return cachedGraph;
}

function updateDiagnostics(
  diagnostics: Array<{
    severity: string;
    message: string;
    loc?: { filePath: string; line: number; column: number };
  }>,
) {
  diagnosticCollection.clear();
  const byFile = new Map<string, vscode.Diagnostic[]>();

  for (const d of diagnostics) {
    if (!d.loc?.filePath) continue;
    const diags = byFile.get(d.loc.filePath) ?? [];
    diags.push(
      new vscode.Diagnostic(
        new vscode.Range(
          Math.max(0, d.loc.line - 1),
          d.loc.column,
          Math.max(0, d.loc.line - 1),
          d.loc.column + 1,
        ),
        d.message,
        d.severity === 'error'
          ? vscode.DiagnosticSeverity.Error
          : vscode.DiagnosticSeverity.Warning,
      ),
    );
    byFile.set(d.loc.filePath, diags);
  }

  for (const [file, diags] of byFile) {
    diagnosticCollection.set(vscode.Uri.file(file), diags);
  }
}

class RouteTreeProvider implements vscode.TreeDataProvider<RouteTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<RouteTreeItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: RouteTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: RouteTreeItem): RouteTreeItem[] {
    if (!cachedGraph) return [];
    if (!element) {
      return cachedGraph.nodes
        .filter((n) => n.attributes.type === 'route')
        .map(
          (n) =>
            new RouteTreeItem(n.attributes.path, n.id, vscode.TreeItemCollapsibleState.Collapsed),
        );
    }

    const incoming = cachedGraph.edges.filter(
      (e) => e.target === element.id && e.attributes.type === 'navigation',
    );
    const outgoing = cachedGraph.edges.filter(
      (e) => e.source === element.id && e.attributes.type === 'navigation',
    );

    return [
      ...incoming.map((e) => {
        const source = cachedGraph!.nodes.find((n) => n.id === e.source);
        return new RouteTreeItem(
          `← ${source?.attributes.path ?? e.source}`,
          e.source,
          vscode.TreeItemCollapsibleState.None,
        );
      }),
      ...outgoing.map((e) => {
        const target = cachedGraph!.nodes.find((n) => n.id === e.target);
        return new RouteTreeItem(
          `→ ${target?.attributes.path ?? e.target}`,
          e.target,
          vscode.TreeItemCollapsibleState.None,
        );
      }),
    ];
  }
}

class RouteTreeItem extends vscode.TreeItem {
  constructor(
    label: string,
    public readonly id: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
  ) {
    super(label, collapsibleState);
  }
}

export function activate(context: vscode.ExtensionContext) {
  const treeProvider = new RouteTreeProvider();
  vscode.window.registerTreeDataProvider('routeIntelligenceRoutes', treeProvider);

  const hoverProvider = vscode.languages.registerHoverProvider(
    ['typescript', 'typescriptreact', 'javascript', 'javascriptreact'],
    {
      provideHover(document, position) {
        if (!cachedGraph) return null;
        const line = document.lineAt(position.line).text;

        const hrefMatch = line.match(/href=["']([^"']+)["']/);
        if (hrefMatch?.[1]) {
          const path = hrefMatch[1];
          const node = cachedGraph.nodes.find((n) => n.attributes.path === path);
          if (node) {
            return new vscode.Hover(
              [
                `**Route:** ${node.attributes.path}`,
                `Type: ${node.attributes.type}`,
                `File: ${node.attributes.filePath}`,
                node.attributes.isDead ? '⚠ Dead route' : '',
              ]
                .filter(Boolean)
                .join('\n\n'),
            );
          }
          return new vscode.Hover(`⚠ Unknown route: ${path}`);
        }
        return null;
      },
    },
  );

  const definitionProvider = vscode.languages.registerDefinitionProvider(
    ['typescript', 'typescriptreact', 'javascript', 'javascriptreact'],
    {
      provideDefinition(document, position) {
        if (!cachedGraph) return null;
        const line = document.lineAt(position.line).text;
        const hrefMatch = line.match(/href=["']([^"']+)["']/);
        if (!hrefMatch?.[1]) return null;

        const node = cachedGraph.nodes.find((n) => n.attributes.path === hrefMatch[1]);
        if (node) {
          return new vscode.Location(
            vscode.Uri.file(node.attributes.filePath),
            new vscode.Position(0, 0),
          );
        }
        return null;
      },
    },
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('route-intelligence.analyze', async () => {
      await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: 'Analyzing routes...' },
        async () => {
          await analyzeWorkspace();
          treeProvider.refresh();
        },
      );
      vscode.window.showInformationMessage('Route analysis complete');
    }),
    vscode.commands.registerCommand('route-intelligence.showGraph', () => {
      const panel = vscode.window.createWebviewPanel(
        'routeGraph',
        'Route Graph',
        vscode.ViewColumn.One,
        { enableScripts: true },
      );
      panel.webview.html = getWebviewContent();
    }),
    hoverProvider,
    definitionProvider,
    diagnosticCollection,
  );

  void analyzeWorkspace().then(() => treeProvider.refresh());

  vscode.workspace.onDidSaveTextDocument(async (doc) => {
    if (/\.(tsx?|jsx?)$/.test(doc.fileName)) {
      await analyzeWorkspace();
      treeProvider.refresh();
    }
  });
}

function getWebviewContent(): string {
  return `<!DOCTYPE html><html><body><h1>Route Graph</h1><p>Run route-intelligence graph for full visualization</p></body></html>`;
}

export function deactivate() {
  diagnosticCollection.dispose();
}

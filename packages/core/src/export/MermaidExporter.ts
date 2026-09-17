import type { RouteGraph } from '../graph/RouteGraph.js';

interface AttachedGraphNode {
  graphNodeId: string;
  type: string;
  path: string;
}

interface PathTreeNode {
  segment: string | null;
  segmentPath: string;
  attachedNodes: AttachedGraphNode[];
  children: Map<string, PathTreeNode>;
}

export function exportMermaid(graph: RouteGraph): string {
  const tree = buildPathTree(graph);

  // Enable the ELK renderer for perfectly spaced subgraphs and set to Left-Right
  const lines: string[] = ['%%{init: {"flowchart": {"defaultRenderer": "elk"}}}%%', 'flowchart LR'];

  const declaredIds = new Set<string>();

  emitPathTree(tree, null, lines, declaredIds);

  for (const edge of graph.getAllEdges()) {
    const attrs = graph.getUnderlyingGraph().getEdgeAttributes(edge.id);
    if (attrs.type === 'layout-parent' || edge.source === edge.target) continue;

    const sourceId = graphNodeToSegmentId(graph, edge.source);
    const targetId = graphNodeToSegmentId(graph, edge.target);
    if (!sourceId || !targetId || !declaredIds.has(sourceId) || !declaredIds.has(targetId)) {
      continue;
    }

    lines.push(`  ${sourceId} -.->|${attrs.type}| ${targetId}`);
  }

  return lines.join('\n');
}

function graphNodeToSegmentId(graph: RouteGraph, nodeId: string): string | undefined {
  const node = graph.getNode(nodeId);
  if (!node) return undefined;

  const segments = parsePathSegments(node.path);
  if (segments.length === 0) return 'seg_root';

  return segmentNodeId(`/${segments.join('/')}`);
}

function buildPathTree(graph: RouteGraph): PathTreeNode {
  const root: PathTreeNode = {
    segment: null,
    segmentPath: '/',
    attachedNodes: [],
    children: new Map(),
  };

  for (const nodeId of graph.getAllNodeIds()) {
    const node = graph.getNode(nodeId);
    if (!node) continue;

    const segments = parsePathSegments(node.path);
    let current = root;

    for (const segment of segments) {
      let child = current.children.get(segment);
      if (!child) {
        const segmentPath =
          current.segmentPath === '/' ? `/${segment}` : `${current.segmentPath}/${segment}`;
        child = {
          segment,
          segmentPath,
          attachedNodes: [],
          children: new Map(),
        };
        current.children.set(segment, child);
      }
      current = child;
    }

    current.attachedNodes.push({
      graphNodeId: nodeId,
      type: node.type,
      path: node.path,
    });
  }

  return root;
}

function emitPathTree(
  node: PathTreeNode,
  parentId: string | null,
  lines: string[],
  declaredIds: Set<string>,
  indent = '  ',
): string {
  const id = segmentNodeId(node.segmentPath);
  declareSegmentNode(node, id, lines, declaredIds, indent);

  if (parentId) {
    lines.push(`${indent}${parentId} --> ${id}`);
  }

  const children = sortPathTreeChildren(node.children);
  if (children.length === 0) {
    return id;
  }

  if (children.length === 1) {
    const [onlyChild] = children;
    if (onlyChild) {
      emitPathTree(onlyChild, id, lines, declaredIds, indent);
    }
    return id;
  }

  const subgraphId = `sg_${sanitizeId(node.segmentPath)}`;
  const subgraphTitle = node.segment ? `${node.segment}/` : '/';

  lines.push(`${indent}subgraph ${subgraphId}["${escapeLabel(subgraphTitle)}"]`);

  // REMOVED: lines.push(`${indent}  direction TB`);
  // By removing this, the subgraph dynamically inherits the clean LR flow

  for (const child of children) {
    emitPathTree(child, id, lines, declaredIds, `${indent}  `);
  }

  lines.push(`${indent}end`);
  return id;
}

function declareSegmentNode(
  node: PathTreeNode,
  id: string,
  lines: string[],
  declaredIds: Set<string>,
  indent: string,
): void {
  if (declaredIds.has(id)) return;
  declaredIds.add(id);
  lines.push(`${indent}${id}["${escapeLabel(formatSegmentLabel(node))}"]`);
}

function formatSegmentLabel(node: PathTreeNode): string {
  const parts: string[] = [];

  if (node.segment === null) {
    parts.push('/');
  } else {
    parts.push(node.segment);
  }

  for (const attached of node.attachedNodes) {
    parts.push(formatAttachedLabel(attached, node.segmentPath));
  }

  return parts.join('<br/>');
}

function formatAttachedLabel(node: AttachedGraphNode, segmentPath: string): string {
  const hashIndex = node.path.indexOf('#');
  const suffix = hashIndex >= 0 ? node.path.slice(hashIndex) : '';
  const urlPath = hashIndex >= 0 ? node.path.slice(0, hashIndex) : node.path;

  if (suffix) {
    return `${node.type} ${suffix}`;
  }

  if (urlPath === segmentPath) {
    return node.type;
  }

  if (segmentPath === '/' && urlPath === '/') {
    return node.type;
  }

  const relative = urlPath.startsWith(`${segmentPath}/`)
    ? urlPath.slice(segmentPath.length + 1)
    : urlPath;

  return `${node.type}: ${relative}`;
}

function parsePathSegments(path: string): string[] {
  const urlPart = path.split('#')[0] ?? path;
  if (urlPart === '/' || urlPart === '') return [];
  return urlPart.split('/').filter(Boolean);
}

function segmentNodeId(segmentPath: string): string {
  if (segmentPath === '/') return 'seg_root';
  const segments = parsePathSegments(segmentPath);
  return `seg_${segments.map((segment) => sanitizeSegmentForId(segment)).join('__')}`;
}

function sanitizeSegmentForId(segment: string): string {
  const sanitized = segment
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  return sanitized || 'wildcard';
}

function sortPathTreeChildren(children: Map<string, PathTreeNode>): PathTreeNode[] {
  return [...children.values()].sort((a, b) => (a.segment ?? '').localeCompare(b.segment ?? ''));
}

function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_]/g, '_');
}

function escapeLabel(label: string): string {
  return label.replace(/"/g, '\\"');
}

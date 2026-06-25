import type {
  EdgeAttributes,
  GraphMetadata,
  NodeAttributes,
  SerializedEdge,
  SerializedGraph,
  SerializedNode,
} from '@route-intelligence/shared';
import type { RouteGraphLike } from '@route-intelligence/shared';
import { MultiDirectedGraph } from 'graphology';

export class RouteGraph implements RouteGraphLike {
  private readonly graph: MultiDirectedGraph<NodeAttributes, EdgeAttributes>;

  constructor() {
    this.graph = new MultiDirectedGraph({ allowSelfLoops: true });
  }

  hasNode(id: string): boolean {
    return this.graph.hasNode(id);
  }

  getNode(id: string): NodeAttributes | undefined {
    if (!this.graph.hasNode(id)) return undefined;
    return this.graph.getNodeAttributes(id);
  }

  getNodePath(id: string): string | undefined {
    return this.getNode(id)?.path;
  }

  findNodeByPath(path: string): string | undefined {
    for (const nodeId of this.graph.nodes()) {
      const attrs = this.graph.getNodeAttributes(nodeId);
      if (attrs.path === path) return nodeId;
    }
    return undefined;
  }

  findNodesByType(type: NodeAttributes['type']): string[] {
    return this.graph.filterNodes((_, attrs) => attrs.type === type);
  }

  addNode(id: string, attributes: NodeAttributes): void {
    if (this.graph.hasNode(id)) {
      this.graph.mergeNodeAttributes(id, attributes);
      return;
    }
    this.graph.addNode(id, attributes);
  }

  removeNode(id: string): void {
    if (this.graph.hasNode(id)) {
      this.graph.dropNode(id);
    }
  }

  addEdge(id: string, source: string, target: string, attributes: EdgeAttributes): void {
    if (!this.graph.hasNode(source) || !this.graph.hasNode(target)) return;
    if (this.graph.hasEdge(id)) {
      this.graph.mergeEdgeAttributes(id, attributes);
      return;
    }
    this.graph.addEdgeWithKey(id, source, target, attributes);
  }

  removeEdge(id: string): void {
    if (this.graph.hasEdge(id)) {
      this.graph.dropEdge(id);
    }
  }

  getAllNodeIds(): string[] {
    return this.graph.nodes();
  }

  getAllEdges(): Array<{ id: string; source: string; target: string }> {
    return this.graph.mapEdges((edge, attrs, source, target) => ({
      id: edge,
      source,
      target,
    }));
  }

  getIncomingEdges(
    nodeId: string,
  ): Array<{ id: string; source: string; attributes: EdgeAttributes }> {
    if (!this.graph.hasNode(nodeId)) return [];
    return this.graph.inEdges(nodeId).map((edgeId) => ({
      id: edgeId,
      source: this.graph.source(edgeId),
      attributes: this.graph.getEdgeAttributes(edgeId),
    }));
  }

  getOutgoingEdges(
    nodeId: string,
  ): Array<{ id: string; target: string; attributes: EdgeAttributes }> {
    if (!this.graph.hasNode(nodeId)) return [];
    return this.graph.outEdges(nodeId).map((edgeId) => ({
      id: edgeId,
      target: this.graph.target(edgeId),
      attributes: this.graph.getEdgeAttributes(edgeId),
    }));
  }

  getUnderlyingGraph(): MultiDirectedGraph<NodeAttributes, EdgeAttributes> {
    return this.graph;
  }

  toJSON(root: string, metadata?: Partial<GraphMetadata>): SerializedGraph {
    const nodes: SerializedNode[] = this.graph.nodes().map((id) => ({
      id,
      attributes: this.graph.getNodeAttributes(id),
    }));

    const edges: SerializedEdge[] = this.graph.edges().map((id) => ({
      id,
      source: this.graph.source(id),
      target: this.graph.target(id),
      attributes: this.graph.getEdgeAttributes(id),
    }));

    return {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      root,
      nodes,
      edges,
      metadata: metadata as GraphMetadata | undefined,
    };
  }

  static fromJSON(data: SerializedGraph): RouteGraph {
    const graph = new RouteGraph();
    for (const node of data.nodes) {
      graph.addNode(node.id, node.attributes);
    }
    for (const edge of data.edges) {
      graph.addEdge(edge.id, edge.source, edge.target, edge.attributes);
    }
    return graph;
  }
}

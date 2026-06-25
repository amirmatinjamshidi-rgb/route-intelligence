import {
  Background,
  Controls,
  type Edge,
  MiniMap,
  type Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { SerializedGraph } from '@route-intelligence/shared';
import { useCallback, useMemo, useState } from 'react';

export type LayoutType = 'hierarchical' | 'force' | 'radial' | 'flow';

export interface VisualizerProps {
  graph: SerializedGraph;
  layout?: LayoutType;
}

export interface OverlayFilters {
  showPublic: boolean;
  showAuth: boolean;
  showAdmin: boolean;
  showMiddleware: boolean;
  showApi: boolean;
  showDynamic: boolean;
  showRedirects: boolean;
  showDead: boolean;
}

const defaultFilters: OverlayFilters = {
  showPublic: true,
  showAuth: true,
  showAdmin: true,
  showMiddleware: true,
  showApi: true,
  showDynamic: true,
  showRedirects: true,
  showDead: false,
};

function graphToFlowNodes(graph: SerializedGraph, filters: OverlayFilters, search: string): Node[] {
  return graph.nodes
    .filter((n) => {
      if (!filters.showDead && n.attributes.isDead) return false;
      if (!filters.showApi && n.attributes.type === 'api-route') return false;
      if (!filters.showDynamic && n.attributes.isDynamic) return false;
      if (!filters.showMiddleware && n.attributes.type === 'middleware') return false;
      if (search && !n.attributes.path.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .map((n, i) => ({
      id: n.id,
      position: { x: (i % 5) * 220, y: Math.floor(i / 5) * 120 },
      data: {
        label: `${n.attributes.type}\n${n.attributes.path}`,
        ...n.attributes,
      },
      style: {
        background: n.attributes.isDead ? '#3f1515' : '#1e3a5f',
        color: '#fff',
        border: `1px solid ${n.attributes.isDead ? '#ef4444' : '#3b82f6'}`,
        borderRadius: 8,
        padding: 8,
        fontSize: 12,
        whiteSpace: 'pre-wrap' as const,
      },
    }));
}

function graphToFlowEdges(graph: SerializedGraph, filters: OverlayFilters): Edge[] {
  return graph.edges
    .filter((e) => {
      if (
        !filters.showRedirects &&
        (e.attributes.type === 'redirect' || e.attributes.type === 'rewrite')
      ) {
        return false;
      }
      return true;
    })
    .map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.attributes.type,
      animated: e.attributes.type === 'navigation',
      style: { stroke: e.attributes.isExternal ? '#f59e0b' : '#64748b' },
    }));
}

export function RouteVisualizer({ graph, layout = 'hierarchical' }: VisualizerProps) {
  const [filters, setFilters] = useState<OverlayFilters>(defaultFilters);
  const [search, setSearch] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const initialNodes = useMemo(
    () => graphToFlowNodes(graph, filters, search),
    [graph, filters, search],
  );
  const initialEdges = useMemo(() => graphToFlowEdges(graph, filters), [graph, filters]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  const selected = graph.nodes.find((n) => n.id === selectedNode);

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          padding: '1rem',
          background: '#111',
          borderBottom: '1px solid #333',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>Route Intelligence</h1>
        <input
          type="search"
          placeholder="Search routes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 200,
            padding: '0.5rem',
            background: '#1a1a1a',
            border: '1px solid #333',
            color: '#fff',
            borderRadius: 4,
          }}
        />
        <select
          value={layout}
          onChange={() => {}}
          style={{
            padding: '0.5rem',
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #333',
          }}
        >
          <option value="hierarchical">Hierarchical</option>
          <option value="force">Force</option>
          <option value="radial">Radial</option>
          <option value="flow">Flow Chart</option>
        </select>
        {(['showDead', 'showApi', 'showDynamic', 'showMiddleware', 'showRedirects'] as const).map(
          (key) => (
            <label key={key} style={{ fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.checked }))}
              />{' '}
              {key.replace('show', '')}
            </label>
          ),
        )}
      </header>
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
        {selected && (
          <aside
            style={{
              width: 320,
              background: '#111',
              borderLeft: '1px solid #333',
              padding: '1rem',
              overflow: 'auto',
            }}
          >
            <h2 style={{ marginTop: 0 }}>{selected.attributes.path}</h2>
            <p>
              <strong>Type:</strong> {selected.attributes.type}
            </p>
            <p>
              <strong>File:</strong> {selected.attributes.filePath}
            </p>
            <p>
              <strong>Depth:</strong> {selected.attributes.depth}
            </p>
            <p>
              <strong>Runtime:</strong> {selected.attributes.runtime}
            </p>
            {selected.attributes.isDead && <p style={{ color: '#ef4444' }}>Dead route</p>}
            {selected.attributes.conditions.length > 0 && (
              <>
                <h3>Conditions</h3>
                <ul>
                  {selected.attributes.conditions.map((c, i) => (
                    <li key={i}>{c.expression}</li>
                  ))}
                </ul>
              </>
            )}
            {selected.attributes.diagnostics.length > 0 && (
              <>
                <h3>Diagnostics</h3>
                <ul>
                  {selected.attributes.diagnostics.map((d, i) => (
                    <li key={i} style={{ color: d.severity === 'error' ? '#ef4444' : '#f59e0b' }}>
                      [{d.ruleId}] {d.message}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}

export default RouteVisualizer;

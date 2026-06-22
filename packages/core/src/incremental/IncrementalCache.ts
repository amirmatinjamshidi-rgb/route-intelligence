import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { GraphPatch, InvalidationSet, SerializedGraph } from '@route-intelligence/shared';
import type { SemanticFile } from '@route-intelligence/shared';

export interface IncrementalCacheData {
  fileHashes: Record<string, string>;
  fileDependencies: Record<string, string[]>;
  graphSnapshot?: SerializedGraph;
}

export class IncrementalCache {
  private fileHashes = new Map<string, string>();
  private fileDependencies = new Map<string, Set<string>>();
  private parsedFiles = new Map<string, SemanticFile>();
  private graphSnapshot: SerializedGraph | null = null;
  private readonly cacheDir: string;

  constructor(cacheDir: string) {
    this.cacheDir = cacheDir;
    this.load();
  }

  hashFile(content: string): string {
    return createHash('sha256').update(content).digest('hex');
  }

  getFileHash(filePath: string): string | undefined {
    return this.fileHashes.get(filePath);
  }

  setFileHash(filePath: string, hash: string): void {
    this.fileHashes.set(filePath, hash);
  }

  getDependencies(filePath: string): Set<string> {
    return this.fileDependencies.get(filePath) ?? new Set();
  }

  setDependencies(filePath: string, nodeIds: Set<string>): void {
    this.fileDependencies.set(filePath, nodeIds);
  }

  getParsedFile(filePath: string): SemanticFile | undefined {
    return this.parsedFiles.get(filePath);
  }

  setParsedFile(filePath: string, file: SemanticFile): void {
    this.parsedFiles.set(filePath, file);
  }

  getGraphSnapshot(): SerializedGraph | null {
    return this.graphSnapshot;
  }

  setGraphSnapshot(snapshot: SerializedGraph): void {
    this.graphSnapshot = snapshot;
  }

  invalidate(filePath: string): InvalidationSet {
    const nodeIds = [...(this.fileDependencies.get(filePath) ?? [])];
    this.parsedFiles.delete(filePath);
    this.fileHashes.delete(filePath);
    this.fileDependencies.delete(filePath);
    return { files: [filePath], nodeIds };
  }

  save(): void {
    if (!existsSync(this.cacheDir)) {
      mkdirSync(this.cacheDir, { recursive: true });
    }

    const data: IncrementalCacheData = {
      fileHashes: Object.fromEntries(this.fileHashes),
      fileDependencies: Object.fromEntries(
        [...this.fileDependencies.entries()].map(([k, v]) => [k, [...v]]),
      ),
      graphSnapshot: this.graphSnapshot ?? undefined,
    };

    writeFileSync(join(this.cacheDir, 'cache.json'), JSON.stringify(data, null, 2));
  }

  private load(): void {
    const cachePath = join(this.cacheDir, 'cache.json');
    if (!existsSync(cachePath)) return;

    try {
      const data = JSON.parse(readFileSync(cachePath, 'utf-8')) as IncrementalCacheData;
      this.fileHashes = new Map(Object.entries(data.fileHashes));
      this.fileDependencies = new Map(
        Object.entries(data.fileDependencies).map(([k, v]) => [k, new Set(v)]),
      );
      this.graphSnapshot = data.graphSnapshot ?? null;
    } catch {
      // Corrupt cache, start fresh
    }
  }
}

export function computeGraphPatch(
  before: SerializedGraph,
  after: SerializedGraph,
): GraphPatch {
  const beforeNodeIds = new Set(before.nodes.map((n) => n.id));
  const afterNodeIds = new Set(after.nodes.map((n) => n.id));
  const beforeEdgeIds = new Set(before.edges.map((e) => e.id));
  const afterEdgeIds = new Set(after.edges.map((e) => e.id));

  return {
    addedNodes: after.nodes.filter((n) => !beforeNodeIds.has(n.id)),
    removedNodeIds: before.nodes.filter((n) => !afterNodeIds.has(n.id)).map((n) => n.id),
    addedEdges: after.edges.filter((e) => !beforeEdgeIds.has(e.id)),
    removedEdgeIds: before.edges.filter((e) => !afterEdgeIds.has(e.id)).map((e) => e.id),
    modifiedNodeIds: after.nodes
      .filter((n) => {
        if (!beforeNodeIds.has(n.id)) return false;
        const prev = before.nodes.find((bn) => bn.id === n.id);
        return JSON.stringify(prev?.attributes) !== JSON.stringify(n.attributes);
      })
      .map((n) => n.id),
  };
}

export function readFileContent(filePath: string): string {
  return readFileSync(filePath, 'utf-8');
}

import { EventEmitter } from 'node:events';
import type {
  AnalysisResult,
  AnalyzerConfig,
  Diagnostic,
  FrameworkPlugin,
  GraphMetadata,
  GraphPatch,
} from '@route-intelligence/shared';
import { defineConfig } from '@route-intelligence/shared';
import chokidar from 'chokidar';
import { exportDot } from './export/DotExporter.js';
import { exportHtml, exportMarkdown } from './export/HtmlExporter.js';
import { exportJson } from './export/JsonExporter.js';
import { exportMermaid } from './export/MermaidExporter.js';
import { exportPlantUML } from './export/PlantUMLExporter.js';
import { RouteGraph } from './graph/RouteGraph.js';
import {
  detectInfiniteRedirects,
  findCycles,
  findDeadRoutes,
  findShortestPath,
  getMostConnected,
} from './graph/algorithms.js';
import { metricsToMetadata } from './graph/metrics.js';
import { IncrementalCache, computeGraphPatch } from './incremental/IncrementalCache.js';
import { Invalidator } from './incremental/Invalidator.js';
import { Pipeline } from './pipeline/Pipeline.js';
import type { PipelineContext } from './pipeline/types.js';
import { PluginRegistry } from './plugin/PluginRegistry.js';

export interface Analyzer {
  analyze(): Promise<AnalysisResult>;
  watch(): GraphWatcher;
}

export interface GraphWatcher extends EventEmitter {
  on(event: 'update', listener: (patch: GraphPatch) => void): this;
  on(event: 'error', listener: (error: Error) => void): this;
  stop(): Promise<void>;
}

class RouteAnalyzer implements Analyzer {
  private readonly registry = new PluginRegistry();

  constructor(private readonly config: AnalyzerConfig) {
    this.registry.registerAll(config.plugins);
  }

  async analyze(): Promise<AnalysisResult> {
    const plugins = await this.registry.detectActive(this.config.root, this.config);
    const graph = new RouteGraph();
    const ctx: PipelineContext = {
      root: this.config.root,
      config: this.config,
      graph,
      plugins,
      files: [],
      semanticFiles: new Map(),
      routes: new Map(),
      pluginConfigs: new Map(),
    };

    for (const plugin of plugins) {
      const projectCtx = { root: this.config.root, config: this.config, pluginConfig: {} };
      const pluginConfig = await plugin.configure(projectCtx);
      ctx.pluginConfigs.set(plugin.id, pluginConfig);
    }

    const pipeline = new Pipeline();
    const { diagnostics, metadata } = await pipeline.run(ctx);

    return { graph: graph as RouteGraph, diagnostics, metadata };
  }

  watch(): GraphWatcher {
    const emitter = new EventEmitter() as GraphWatcher;
    const cacheDir = this.config.cache?.directory ?? '.route-intelligence';
    const cache = new IncrementalCache(cacheDir);
    const invalidator = new Invalidator(cache);
    let previousSnapshot = cache.getGraphSnapshot();
    let watcher: ReturnType<typeof chokidar.watch> | null = null;

    const runAnalysis = async () => {
      try {
        const result = await this.analyze();
        const routeGraph = result.graph as RouteGraph;
        const snapshot = routeGraph.toJSON(this.config.root, result.metadata);
        cache.setGraphSnapshot(snapshot);
        cache.save();

        if (previousSnapshot) {
          const patch = computeGraphPatch(previousSnapshot, snapshot);
          emitter.emit('update', patch);
        }
        previousSnapshot = snapshot;
      } catch (error) {
        emitter.emit('error', error instanceof Error ? error : new Error(String(error)));
      }
    };

    watcher = chokidar.watch(this.config.root, {
      ignored: this.config.exclude ?? ['**/node_modules/**', '**/.next/**'],
      ignoreInitial: true,
    });

    watcher.on('all', async (event, path) => {
      const type = event === 'add' ? 'add' : event === 'unlink' ? 'unlink' : 'change';
      invalidator.computeInvalidation({ type, path });
      await runAnalysis();
    });

    void runAnalysis();

    emitter.stop = async () => {
      await watcher?.close();
    };

    return emitter;
  }
}

export function createAnalyzer(config: AnalyzerConfig): Analyzer {
  return new RouteAnalyzer(config);
}

export { defineConfig };
export { RouteGraph };
export { findCycles, findDeadRoutes, findShortestPath, detectInfiniteRedirects, getMostConnected };
export { exportJson, exportMermaid, exportPlantUML, exportDot, exportHtml, exportMarkdown };
export { PluginRegistry };
export { IncrementalCache, Invalidator, computeGraphPatch };
export type {
  AnalysisResult,
  AnalyzerConfig,
  Diagnostic,
  GraphMetadata,
  GraphPatch,
  FrameworkPlugin,
};

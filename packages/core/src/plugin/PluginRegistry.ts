import type { FrameworkPlugin } from '@route-intelligence/shared';

export class PluginRegistry {
  private plugins: FrameworkPlugin[] = [];

  register(plugin: FrameworkPlugin): void {
    this.plugins.push(plugin);
  }

  registerAll(plugins: FrameworkPlugin[]): void {
    for (const plugin of plugins) {
      this.register(plugin);
    }
  }

  getAll(): FrameworkPlugin[] {
    return [...this.plugins];
  }

  async detectActive(root: string, config: import('@route-intelligence/shared').AnalyzerConfig): Promise<FrameworkPlugin[]> {
    const active: FrameworkPlugin[] = [];

    for (const plugin of this.plugins) {
      const ctx = { root, config, pluginConfig: {} };
      if (await plugin.detect(ctx)) {
        active.push(plugin);
      }
    }

    return active;
  }
}

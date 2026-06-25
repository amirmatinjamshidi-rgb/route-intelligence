import { Project } from 'ts-morph';
import { createSemanticFile } from '../../ast/SemanticFile.js';
import type { PipelineContext, PipelineStage } from '../types.js';

export class ParseStage implements PipelineStage {
  readonly name = 'ParseStage';
  private project: Project | null = null;

  async run(ctx: PipelineContext): Promise<void> {
    if (!this.project) {
      this.project = new Project({
        skipAddingFilesFromTsConfig: true,
        compilerOptions: {
          allowJs: true,
          jsx: 4,
        },
      });
    }

    const customWrappers = this.getCustomWrappers(ctx);

    for (const filePath of ctx.files) {
      if (!/\.(tsx?|jsx?)$/.test(filePath)) continue;

      try {
        let sourceFile = this.project.getSourceFile(filePath);
        if (!sourceFile) {
          sourceFile = this.project.addSourceFileAtPath(filePath);
        }
        ctx.semanticFiles.set(filePath, createSemanticFile(sourceFile, filePath, customWrappers));
      } catch {
        // Skip unparseable files
      }
    }
  }

  private getCustomWrappers(ctx: PipelineContext): string[] {
    const wrappers: string[] = [];
    for (const config of ctx.pluginConfigs.values()) {
      const custom = config.customNavigationWrappers;
      if (Array.isArray(custom)) {
        wrappers.push(...(custom as string[]));
      }
    }
    return wrappers;
  }
}

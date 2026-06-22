import fg from 'fast-glob';
import picomatch from 'picomatch';
import type { PipelineContext, PipelineStage } from './types.js';

export class FileSystemStage implements PipelineStage {
  readonly name = 'FileSystemStage';

  async run(ctx: PipelineContext): Promise<void> {
    const include = ctx.config.include ?? ['**/*.{ts,tsx,js,jsx}'];
    const exclude = ctx.config.exclude ?? [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/*.test.*',
      '**/*.spec.*',
    ];

    const files = await fg(include, {
      cwd: ctx.root,
      absolute: true,
      ignore: exclude,
      onlyFiles: true,
    });

    const isExcluded = picomatch(exclude);
    ctx.files = files.filter((f) => !isExcluded(f));
  }
}

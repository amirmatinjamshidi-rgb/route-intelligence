import type { PipelineContext, PipelineStage } from '../types.js';

export class SemanticStage implements PipelineStage {
  readonly name = 'SemanticStage';

  async run(_ctx: PipelineContext): Promise<void> {
    // Semantic enrichment happens lazily via SemanticFile getters during later stages
  }
}

import type { FileChangeEvent, InvalidationSet } from '@route-intelligence/shared';
import { type IncrementalCache, readFileContent } from './IncrementalCache.js';

export class Invalidator {
  constructor(private readonly cache: IncrementalCache) {}

  computeInvalidation(event: FileChangeEvent): InvalidationSet {
    if (event.type === 'unlink') {
      return this.cache.invalidate(event.path);
    }

    if (event.type === 'change' || event.type === 'add') {
      try {
        const content = readFileContent(event.path);
        const newHash = this.cache.hashFile(content);
        const oldHash = this.cache.getFileHash(event.path);

        if (oldHash === newHash) {
          return { files: [], nodeIds: [] };
        }

        this.cache.setFileHash(event.path, newHash);
        return this.cache.invalidate(event.path);
      } catch {
        return this.cache.invalidate(event.path);
      }
    }

    return { files: [], nodeIds: [] };
  }

  getAffectedFiles(invalidation: InvalidationSet): string[] {
    return invalidation.files;
  }
}

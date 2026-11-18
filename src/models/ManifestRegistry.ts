import type { ModelInfo, ModelRegistry } from '../core';
import manifest from './manifest.json';

const SHA256_HEX = /^[0-9a-f]{64}$/;

/** Um modelo só pode ser baixado/carregado se o manifesto tiver hash válido. */
export function hasValidHash(model: ModelInfo): boolean {
  return SHA256_HEX.test(model.sha256);
}

export class ManifestRegistry implements ModelRegistry {
  private readonly models: ModelInfo[];

  constructor(models: ModelInfo[] = manifest.models as ModelInfo[]) {
    this.models = models;
  }

  list(): ModelInfo[] {
    return [...this.models];
  }

  get(id: string): ModelInfo | undefined {
    return this.models.find(m => m.id === id);
  }
}

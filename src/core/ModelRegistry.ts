import type { ModelInfo } from './types';

/** Lê o manifesto de modelos disponíveis. */
export interface ModelRegistry {
  list(): ModelInfo[];
  get(id: string): ModelInfo | undefined;
}

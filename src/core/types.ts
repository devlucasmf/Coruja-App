/**
 * Tipos compartilhados do núcleo do Coruja.
 * Nada aqui depende de React Native, llama.rn ou SQLite.
 */

export type Role = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: Role;
  content: string;
}

/** Entrada de um modelo no manifesto (src/models/manifest.json). */
export interface ModelInfo {
  id: string;
  name: string;
  /** Nome do arquivo GGUF salvo no aparelho. */
  file: string;
  /** URL de download (usada só no primeiro uso, iniciado pelo usuário). */
  url: string;
  /** SHA-256 em hexadecimal; o arquivo só é carregado se bater. */
  sha256: string;
  sizeBytes: number;
  /** RAM total mínima do aparelho, em GB, para este modelo ser o padrão. */
  minRamGb: number;
  /** Tamanho de contexto recomendado (tokens). */
  defaultContext: number;
  /** Modelo de reserva quando falta RAM livre. */
  fallbackId?: string;
}

export interface LoadParams {
  contextSize: number;
  threads?: number;
  useMmap: boolean;
  useMlock: boolean;
}

export interface GenerateOptions {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stop?: string[];
}

export interface GenerationResult {
  text: string;
  tokensGenerated: number;
  tokensPerSecond: number;
  stoppedByUser: boolean;
}

export interface EngineStats {
  loadedModelId: string | null;
  contextSize: number;
  lastTokensPerSecond: number | null;
}

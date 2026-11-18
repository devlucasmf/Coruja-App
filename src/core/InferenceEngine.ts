import type {
  ChatMessage,
  EngineStats,
  GenerateOptions,
  GenerationResult,
  LoadParams,
  ModelInfo,
} from './types';

/**
 * Contrato do motor de inferência. Hoje será implementado por LlamaEngine
 * (llama.rn); outro motor (ONNX, MLC, ExecuTorch) só precisa seguir esta
 * interface para entrar sem mudar a UI.
 */
export interface InferenceEngine {
  load(model: ModelInfo, modelPath: string, params: LoadParams): Promise<void>;
  generate(
    messages: ChatMessage[],
    opts: GenerateOptions,
    onToken: (token: string) => void,
  ): Promise<GenerationResult>;
  stop(): Promise<void>;
  unload(): Promise<void>;
  stats(): EngineStats;
}

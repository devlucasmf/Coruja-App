/** Ditado por voz local (whisper.rn no passo 3). */
export interface SpeechToText {
  load(modelPath: string): Promise<void>;
  start(onPartial: (text: string) => void): Promise<void>;
  stopAndTranscribe(): Promise<string>;
  /** Libera memória antes do LLM gerar, em aparelhos de 4-5 GB. */
  unload(): Promise<void>;
}

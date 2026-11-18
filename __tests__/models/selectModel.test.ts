import type { ModelInfo } from '../../src/core';
import {
  ManifestRegistry,
  fitToFreeRam,
  hasValidHash,
  pickDefaultModel,
} from '../../src/models';

const GB = 1024 ** 3;

const small: ModelInfo = {
  id: 'small',
  name: 'Small',
  file: 's.gguf',
  url: 'https://example.com/s.gguf',
  sha256: 'a'.repeat(64),
  sizeBytes: 1 * GB,
  minRamGb: 4,
  defaultContext: 2048,
};
const big: ModelInfo = {
  ...small,
  id: 'big',
  sizeBytes: 2 * GB,
  minRamGb: 6,
  defaultContext: 4096,
  fallbackId: 'small',
};
const models = [small, big];

describe('pickDefaultModel', () => {
  it('usa o 1.5B em aparelho de 4 GB (que reporta ~3,7 GB)', () => {
    expect(pickDefaultModel(models, 3.7 * GB)?.id).toBe('small');
  });
  it('usa o 3B em aparelho de 6 GB ou mais', () => {
    expect(pickDefaultModel(models, 5.6 * GB)?.id).toBe('big');
    expect(pickDefaultModel(models, 12 * GB)?.id).toBe('big');
  });
  it('não escolhe nada abaixo do mínimo', () => {
    expect(pickDefaultModel(models, 2.5 * GB)).toBeUndefined();
  });
});

describe('fitToFreeRam', () => {
  it('mantém modelo e contexto quando sobra memória', () => {
    const c = fitToFreeRam(models, big, 4 * GB);
    expect(c).toMatchObject({ model: big, contextSize: 4096 });
    expect(c?.warning).toBeUndefined();
  });
  it('reduz o contexto antes de trocar de modelo', () => {
    const c = fitToFreeRam(models, big, 2.4 * GB);
    expect(c?.model.id).toBe('big');
    expect(c?.contextSize).toBeLessThan(4096);
    expect(c?.warning).toBeDefined();
  });
  it('cai para o modelo de reserva quando o 3B não cabe', () => {
    const c = fitToFreeRam(models, big, 1.5 * GB);
    expect(c?.model.id).toBe('small');
    expect(c?.warning).toBeDefined();
  });
  it('retorna undefined quando nada cabe', () => {
    expect(fitToFreeRam(models, big, 0.5 * GB)).toBeUndefined();
  });
});

describe('manifesto', () => {
  it('tem os dois modelos Qwen da arquitetura', () => {
    const ids = new ManifestRegistry().list().map(m => m.id);
    expect(ids).toEqual([
      'qwen2.5-1.5b-instruct-q4_k_m',
      'qwen2.5-3b-instruct-q4_k_m',
    ]);
  });
  it('recusa modelo sem SHA-256 válido', () => {
    expect(hasValidHash({ ...small, sha256: 'PENDENTE' })).toBe(false);
    expect(hasValidHash(small)).toBe(true);
  });
});

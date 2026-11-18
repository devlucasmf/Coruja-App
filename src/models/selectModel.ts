import type { ModelInfo } from '../core';

const GB = 1024 ** 3;

export interface ModelChoice {
  model: ModelInfo;
  contextSize: number;
  /** Mensagem em PT-BR para avisar o usuário quando houve redução. */
  warning?: string;
}

/**
 * Escolhe o modelo padrão pela RAM total do aparelho (tabela 2.3 da
 * arquitetura): o maior modelo cujo minRamGb cabe na RAM total.
 */
export function pickDefaultModel(
  models: ModelInfo[],
  totalRamBytes: number,
): ModelInfo | undefined {
  // Margem de 0,5 GB: aparelhos "de 4 GB" reportam um pouco menos.
  const totalGb = totalRamBytes / GB + 0.5;
  return [...models]
    .filter(m => m.minRamGb <= totalGb)
    .sort((a, b) => b.minRamGb - a.minRamGb)[0];
}

/** Estimativa grosseira de RAM do KV cache por token, por tamanho de modelo. */
function kvBytesPerToken(model: ModelInfo): number {
  return model.minRamGb >= 6 ? 36 * 1024 : 28 * 1024;
}

function estimateNeededBytes(model: ModelInfo, ctx: number): number {
  return model.sizeBytes + kvBytesPerToken(model) * ctx + 300 * 1024 * 1024;
}

/**
 * Regra extra da seção 2.3: antes de carregar, confere a RAM livre.
 * Se faltar, reduz o contexto pela metade (mínimo 1024) e depois cai
 * para o modelo de reserva.
 */
export function fitToFreeRam(
  models: ModelInfo[],
  preferred: ModelInfo,
  freeRamBytes: number,
): ModelChoice | undefined {
  let model: ModelInfo | undefined = preferred;
  let reduced = false;
  while (model) {
    for (let ctx = model.defaultContext; ctx >= 1024; ctx /= 2) {
      if (estimateNeededBytes(model, ctx) <= freeRamBytes) {
        const changed = reduced || ctx !== model.defaultContext;
        return {
          model,
          contextSize: ctx,
          warning: changed
            ? 'Pouca memória livre: usei um modelo ou contexto menor para o app não fechar.'
            : undefined,
        };
      }
    }
    reduced = true;
    model = model.fallbackId
      ? models.find(m => m.id === model!.fallbackId)
      : undefined;
  }
  return undefined;
}

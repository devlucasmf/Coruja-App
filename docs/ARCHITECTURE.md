# Arquitetura do Coruja

Versão 1.0, 18/11/2026. Resumo das decisões da Fase 1.

## Princípio

Núcleo isolado por interfaces: motor, modelo e armazenamento podem ser trocados sem tocar na UI.

```
UI (React Native)            Chat | Cofre | Config
Features (casos de uso)      ChatService · MemoryService · ModelManager
Contratos (src/core)         InferenceEngine · ModelRegistry · Storage · SpeechToText
Adaptadores                  LlamaEngine (llama.rn) · ManifestRegistry · SecureStorage (SQLCipher)
Nativo                       llama.cpp (Metal / NEON), whisper.cpp
```

## Contratos

| Interface | Arquivo | Implementação |
|---|---|---|
| `InferenceEngine` | `src/core/InferenceEngine.ts` | `LlamaEngine` (passo 2) |
| `ModelRegistry` | `src/core/ModelRegistry.ts` | `ManifestRegistry` (pronto) |
| `Storage` | `src/core/Storage.ts` | SQLite + SQLCipher via op-sqlite (passo 3) |
| `SpeechToText` | `src/core/SpeechToText.ts` | whisper.rn (passo 3) |

## Seleção de modelo por RAM

| RAM total | Modelo padrão | Contexto |
|---|---|---|
| 4 a 5 GB | Qwen 2.5 1.5B Q4_K_M (~1 GB) | 2048 |
| 6 GB ou mais | Qwen 2.5 3B Q4_K_M (~2 GB) | 4096 |

Antes de carregar, `fitToFreeRam` confere a RAM livre: reduz o contexto e, se ainda faltar, cai para o modelo de reserva, avisando o usuário. Implementado em `src/models/selectModel.ts`.

## Inferência

- Q4_K_M como padrão; mmap ligado, mlock desligado.
- Threads adaptativas pelo estado térmico.
- KV cache reaproveitado entre turnos.
- Streaming em lote para a UI (~50 ms).
- Chat template lido do GGUF; prompt de sistema em PT-BR.

## Segurança

- Zero rede no núcleo; só o download de modelo, iniciado pelo usuário.
- Todo GGUF verificado por SHA-256 do manifesto antes de carregar. Entradas com hash `PENDENTE` são recusadas (`hasValidHash`).
- Dados criptografados (SQLCipher, AES-256), chave no Keychain/Keystore.
- Sem telemetria; backup na nuvem desativado para dados sensíveis; Cofre com biometria opcional.

## Decisões fechadas

- **Entrega do modelo:** download no primeiro uso, com retomada e SHA-256. Importação manual de GGUF como extra.
- **Armazenamento:** SQLite + SQLCipher (op-sqlite); sqlite-vec disponível para busca semântica futura.
- **Cofre v1:** histórico + notas com FTS5; tabela de vetores reservada.
- **Voz:** whisper.rn, tiny em 4-5 GB, base em 6 GB+; descarregado antes do LLM gerar em 4-5 GB.
- **CI/CD:** GitHub Actions + Fastlane; Android em Linux, iOS em macOS.

# Coruja 🦉

Assistente de IA que roda 100% no celular, em português do Brasil. Sem nuvem, sem telemetria: depois de baixar o modelo, funciona em modo avião.

- **App:** React Native + TypeScript (Android e iOS)
- **Motor:** llama.cpp via llama.rn
- **Modelos:** Qwen 2.5 1.5B / 3B em GGUF Q4_K_M, escolhidos pela RAM do aparelho
- **Dados:** SQLite criptografado (SQLCipher), chave no Keychain/Keystore

A arquitetura completa está em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Roteiro

1. **Fundação** (este passo): projeto, estrutura de pastas, contratos centrais, CI com APK Android.
2. **Núcleo de IA em PT-BR:** LlamaEngine, download com verificação SHA-256, seleção por RAM, tela de Chat.
3. **Dados, Cofre e voz:** armazenamento criptografado, histórico, Cofre com busca, biometria, ditado local.
4. **iOS, qualidade e lojas:** build iOS, testes de estresse e PT-BR, Fastlane, publicação.

## Rodando localmente

Requisitos: Node 22+, JDK 17, Android Studio (SDK + emulador). Para iOS: macOS com Xcode e CocoaPods.

```sh
npm install
npm start            # Metro
npm run android      # em outro terminal, com emulador aberto
```

Checagens:

```sh
npm run lint
npm run typecheck
npm test
```

## Baixando o APK pelo CI

Cada push e pull request roda o workflow **CI**. Na página da execução, em *Artifacts*, baixe `coruja-debug-apk` e instale no Android.

## Estrutura

```
app/            telas e navegação
src/core/       contratos (interfaces) e tipos, sem dependência de plataforma
src/engines/    motores de inferência (LlamaEngine)
src/models/     manifesto de modelos e seleção por RAM
src/storage/    armazenamento seguro
src/features/   casos de uso (chat, memória, configurações)
src/ui/         design system
native/         ajustes nativos
docs/           documentação
ci/             testes de estresse e PT-BR
```

## Referência

O [PocketPal AI](https://github.com/a-ghorbani/pocketpal-ai) (licença MIT) é usado como referência de estudo. Qualquer trecho reaproveitado mantém o aviso de copyright original.

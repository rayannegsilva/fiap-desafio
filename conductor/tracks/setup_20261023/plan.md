# Plan: Setup de dependências e ferramentas

Origem e detalhes (código, comandos, asserções): [`docs/superpowers/plans/2026-10-23-setup.md`](../../../docs/superpowers/plans/2026-10-23-setup.md). Cada task abaixo corresponde à task de mesmo número lá. Seguir `conductor/workflow.md`.

## Phase 1: Base e qualidade

- [x] Task 1: Consolidar base atual [b42f7eb]
    - [x] Conferir `git status` (só base, docs, assets)
    - [x] `yarn lint && yarn test` passam
    - [x] Commit `chore: set up yarn, restyle and reanimated base`
- [x] Task 2: Husky + commitlint + typecheck [025d9d9]
    - [x] Instalar husky, @commitlint/cli, @commitlint/config-conventional; scripts `typecheck` e `prepare`
    - [x] Confirmar que `conductor(plan): ...` falha sem config
    - [x] `commitlint.config.js` com tipo `conductor`; verificar mensagens válida/inválida
    - [x] Hooks `commit-msg`, `pre-commit`, `pre-push`
    - [x] Commit `chore(tooling): add husky and commitlint`
- [x] Task 3: Infra de testes + App em `src/` [0891e68]
    - [x] Instalar RNTL + test-renderer; remover react-test-renderer, @types/react-test-renderer, @react-native/new-app-screen; safe-area-context ^5.10.1
    - [x] `jest.config.js` e `jest.setup.ts` (Reanimated, worklets, safe-area)
    - [x] Escrever testes: `src/App.test.tsx`, `src/test/libraries.test.tsx` (safe-area, reanimated) — confirmar FAIL
    - [x] `src/App.tsx`, `index.js`, `renderWithProviders`; remover `App.tsx` e `__tests__/` — confirmar PASS
    - [x] Commit `test: set up testing library and move app to src`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) [checkpoint: 0891e68]

## Phase 2: Bibliotecas do app

- [x] Task 4: SVG [9dd1621]
    - [x] Instalar react-native-svg + react-native-svg-transformer; `pod install`
    - [x] Metro, `src/types/svg.d.ts`, mock `__mocks__/svgMock.js` + `moduleNameMapper`
    - [x] Escrever testes: `src/assets/icons/icons.test.ts` (currentColor) e smoke de import SVG — confirmar FAIL
    - [x] Normalizar SVGs — confirmar PASS
    - [x] Commit `build(svg): add react-native-svg with svg transformer`
- [x] Task 5: Navegação [e55738b]
    - [x] Instalar native, native-stack, bottom-tabs, screens; `pod install`
    - [x] `MainActivity.onCreate(null)`
    - [x] Smoke test: stack dentro de tabs renderiza
    - [x] Commit `build(navigation): add react navigation stack and tabs`
- [x] Task 6: Estado e persistência [5982d7d]
    - [x] Instalar zustand + async-storage; `pod install`; mock no `jest.setup.ts`
    - [x] Smoke test: store persistida grava no AsyncStorage
    - [x] Commit `build(state): add zustand and async storage`
- [x] Task 7: Lottie [8e6dadb]
    - [x] Instalar lottie-react-native; `pod install`; mock no `jest.setup.ts`
    - [x] Smoke test: renderiza e repassa `onAnimationFinish`
    - [x] Commit `build(lottie): add lottie-react-native`
- [x] Task 8: Fontes + verificação nativa [b14ab39]
    - [x] Baixar Montserrat (4 pesos) para `src/assets/fonts/`
    - [x] `react-native-asset` + `react-native.config.js`; conferir `UIAppFonts` e `android/app/src/main/assets/fonts`
    - [x] Build `yarn ios` e `yarn android` com texto em Montserrat-SemiBold (temporário, revertido); Android sem crash ao restaurar activity
    - [x] `yarn lint && yarn typecheck && CI=true yarn test --coverage`
    - [x] Commit `build(fonts): link montserrat with react-native-asset`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) [checkpoint: b14ab39]

## Phase 3: Documentação

- [x] Task 9: README [d4554a7]
    - [x] Atualizar Stack, Como rodar, Estrutura, Status
    - [x] `yarn lint && yarn typecheck && CI=true yarn test`
    - [x] Commit `docs: update readme with project setup`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) [checkpoint: d4554a7]

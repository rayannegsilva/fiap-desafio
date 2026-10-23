# Plan: Setup de dependências e ferramentas

Origem e detalhes (código, comandos, asserções): [`docs/superpowers/plans/2026-10-23-setup.md`](../../../docs/superpowers/plans/2026-10-23-setup.md). Cada task abaixo corresponde à task de mesmo número lá. Seguir `conductor/workflow.md`.

## Phase 1: Base e qualidade

- [x] Task 1: Consolidar base atual [b42f7eb]
    - [x] Conferir `git status` (só base, docs, assets)
    - [x] `yarn lint && yarn test` passam
    - [x] Commit `chore: set up yarn, restyle and reanimated base`
- [ ] Task 2: Husky + commitlint + typecheck
    - [ ] Instalar husky, @commitlint/cli, @commitlint/config-conventional; scripts `typecheck` e `prepare`
    - [ ] Confirmar que `conductor(plan): ...` falha sem config
    - [ ] `commitlint.config.js` com tipo `conductor`; verificar mensagens válida/inválida
    - [ ] Hooks `commit-msg`, `pre-commit`, `pre-push`
    - [ ] Commit `chore(tooling): add husky and commitlint`
- [ ] Task 3: Infra de testes + App em `src/`
    - [ ] Instalar RNTL + test-renderer; remover react-test-renderer, @types/react-test-renderer, @react-native/new-app-screen; safe-area-context ^5.10.1
    - [ ] `jest.config.js` e `jest.setup.ts` (Reanimated, worklets, safe-area)
    - [ ] Escrever testes: `src/App.test.tsx`, `src/test/libraries.test.tsx` (safe-area, reanimated) — confirmar FAIL
    - [ ] `src/App.tsx`, `index.js`, `renderWithProviders`; remover `App.tsx` e `__tests__/` — confirmar PASS
    - [ ] Commit `test: set up testing library and move app to src`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Bibliotecas do app

- [ ] Task 4: SVG
    - [ ] Instalar react-native-svg + react-native-svg-transformer; `pod install`
    - [ ] Metro, `src/types/svg.d.ts`, mock `__mocks__/svgMock.js` + `moduleNameMapper`
    - [ ] Escrever testes: `src/assets/icons/icons.test.ts` (currentColor) e smoke de import SVG — confirmar FAIL
    - [ ] Normalizar SVGs — confirmar PASS
    - [ ] Commit `build(svg): add react-native-svg with svg transformer`
- [ ] Task 5: Navegação
    - [ ] Instalar native, native-stack, bottom-tabs, screens; `pod install`
    - [ ] `MainActivity.onCreate(null)`
    - [ ] Smoke test: stack dentro de tabs renderiza
    - [ ] Commit `build(navigation): add react navigation stack and tabs`
- [ ] Task 6: Estado e persistência
    - [ ] Instalar zustand + async-storage; `pod install`; mock no `jest.setup.ts`
    - [ ] Smoke test: store persistida grava no AsyncStorage
    - [ ] Commit `build(state): add zustand and async storage`
- [ ] Task 7: Lottie
    - [ ] Instalar lottie-react-native; `pod install`; mock no `jest.setup.ts`
    - [ ] Smoke test: renderiza e repassa `onAnimationFinish`
    - [ ] Commit `build(lottie): add lottie-react-native`
- [ ] Task 8: Fontes + verificação nativa
    - [ ] Baixar Montserrat (4 pesos) para `src/assets/fonts/`
    - [ ] `react-native-asset` + `react-native.config.js`; conferir `UIAppFonts` e `android/app/src/main/assets/fonts`
    - [ ] Build `yarn ios` e `yarn android` com texto em Montserrat-SemiBold (temporário, revertido); Android sem crash ao restaurar activity
    - [ ] `yarn lint && yarn typecheck && CI=true yarn test --coverage`
    - [ ] Commit `build(fonts): link montserrat with react-native-asset`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Documentação

- [ ] Task 9: README
    - [ ] Atualizar Stack, Como rodar, Estrutura, Status
    - [ ] `yarn lint && yarn typecheck && CI=true yarn test`
    - [ ] Commit `docs: update readme with project setup`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

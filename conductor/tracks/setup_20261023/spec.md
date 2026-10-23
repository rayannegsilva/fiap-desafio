# Spec: Setup de dependências e ferramentas

**Tipo:** Chore
**Origem:** [`docs/superpowers/plans/2026-10-23-setup.md`](../../../docs/superpowers/plans/2026-10-23-setup.md) — detalhes de código, comandos e testes de cada task estão lá.

## Visão geral

Instalar e configurar todas as bibliotecas e ferramentas do projeto, cada uma funcionando no app (iOS e Android) e no Jest, antes de qualquer tela. As tracks seguintes só usam as bibliotecas, sem instalar nada.

## Requisitos funcionais

1. **Base consolidada:** mudanças atuais (yarn, Restyle, Reanimated + worklets, Pods, docs, assets) commitadas como ponto de partida.
2. **Qualidade de commits:** Husky + commitlint (`config-conventional` + tipo `conductor`); hooks `commit-msg` (commitlint), `pre-commit` (lint + typecheck), `pre-push` (testes); script `typecheck`.
3. **Infra de testes:** React Native Testing Library 14 + `test-renderer`; `jest.config.js` com resolver do Reanimated, `jest.setup.ts`, `transformIgnorePatterns` próprio e cobertura ≥ 80%; `App` em `src/App.tsx` (named export); template removido; `renderWithProviders` com `SafeAreaProvider`; safe-area-context 5.10.
4. **SVG:** `react-native-svg` + `react-native-svg-transformer` (Metro, tipos, mock no Jest); ícones de `src/assets/icons/` normalizados para `fill="currentColor"`.
5. **Navegação:** `@react-navigation/native`, `native-stack`, `bottom-tabs`, `react-native-screens`; `MainActivity.onCreate(null)` no Android.
6. **Estado e persistência:** `zustand` + `@react-native-async-storage/async-storage` com mock no Jest.
7. **Lottie:** `lottie-react-native` com mock no Jest que repassa props.
8. **Fontes:** Montserrat Regular/Medium/SemiBold/Bold em `src/assets/fonts/`, linkadas com `react-native-asset`.
9. **README:** stack, comandos, hooks e status atualizados.

## Requisitos não funcionais

- Gerenciador yarn; `pod install` após cada dependência nativa.
- Cada biblioteca tem smoke test em `src/test/libraries.test.tsx` provando que o Jest a transforma e mocka.
- Um commit por task (Conventional Commits, corpo com 3–5 linhas).

## Critérios de aceite

1. Todas as bibliotecas nas versões alvo do plano de origem em `package.json`.
2. `src/test/libraries.test.tsx` passa: SVG como componente, Lottie, navegação (stack e tabs), Zustand persistido em AsyncStorage, safe area, Reanimated.
3. Commit fora do padrão é rejeitado; `conductor(plan): ...` é aceito.
4. `yarn ios` e `yarn android` compilam e abrem o app; Montserrat renderiza nos dois; Android não quebra ao restaurar a activity.
5. `yarn lint`, `yarn typecheck` e `CI=true yarn test --coverage` passam.
6. README reflete stack e comandos.

## Fora de escopo

- Telas reais, tokens de design no código, tema, navegação do app, splash.
- E2E.

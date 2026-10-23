# Plan: Tema e navegação (fundação)

Origem e detalhes (código, comandos, asserções): [`docs/superpowers/plans/2026-10-23-theme-navigation-foundation.md`](../../../docs/superpowers/plans/2026-10-23-theme-navigation-foundation.md). Cada task abaixo corresponde à task de mesmo número lá. Seguir `conductor/workflow.md`.

## Phase 1: Tema

- [x] Task 1: Paleta e tema Restyle [f999e46]
    - [x] Escrever testes falhando (`theme.test.ts`: tokens de cor, 14 variantes + `defaults`, `bodyStrong`)
    - [x] Implementar `palette.ts` (11 tokens de cor, dark/light)
    - [x] Implementar `theme.ts` (`createTheme`, spacing, borderRadii, textVariants)
    - [x] Confirmar PASS
    - [x] Commit `feat(theme): add restyle dark and light themes`
- [x] Task 2: Store de tema persistida + hook `useAppTheme` [697c030]
    - [x] Escrever teste falhando da store (`useThemeStore.test.ts`: default dark, toggle + persistência)
    - [x] Implementar `useThemeStore.ts` (Zustand + persist + AsyncStorage)
    - [x] Confirmar PASS
    - [x] Escrever teste falhando do hook (`useAppTheme.test.tsx`)
    - [x] Implementar `useAppTheme.ts`
    - [x] Confirmar PASS
    - [x] Commit `feat(theme): add persisted theme store and useAppTheme hook`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) [checkpoint: 697c030]

## Phase 2: Navegação

- [x] Task 3: `Box`/`Text` tipados, tipos de rota e telas placeholder [4cc8e25]
    - [x] Escrever testes falhando das 4 telas (`Login`, `Aulas`, `Boletim`, `TrocaAluno`)
    - [x] Implementar `src/theme/restyle.ts` (`Box`, `Text`)
    - [x] Implementar `routes/types.ts` (`RootStackParamList`, `MainTabParamList`)
    - [x] Implementar as 4 telas placeholder
    - [x] **Desvio:** telas usam `Box`/`Text` do Restyle, que exigem `ThemeProvider` no contexto — sem ele o teste falha em runtime (`Value 'background' does not exist in theme['colors']`), não só por módulo faltando. Adiantado o `ThemeProvider` (via `Providers` interno) pro `renderWithProviders` nesta task; Task 4 só adiciona `NavigationContainer` e extrai `AppProviders` reutilizável por `App.tsx`.
    - [x] Confirmar PASS
    - [x] Commit `feat(routes): add typed route params and placeholder screens`
- [x] Task 4: `renderWithProviders` estendido e bottom-tabs [4e89dbb]
    - [x] Escrever teste falhando do `MainTabNavigator` (cor dos ícones ativa/inativa, troca de aba)
    - [x] Implementar `AppProviders.tsx` e atualizar `renderWithProviders.tsx` (`NavigationContainer`; `ThemeProvider` já tinha entrado na Task 3)
    - [x] Implementar `MainTabNavigator.tsx`
    - [x] **Desvio 1:** React Navigation renderiza cada `tabBarIcon` duas vezes (crossfade de cor focado/não-focado); teste de cor identifica o ícone visível pelo wrapper com `opacity: 1`, não por índice.
    - [x] **Desvio 2:** `src/test/libraries.test.tsx` tinha um `<NavigationContainer>` próprio no smoke test de navegação — duplicava o que `renderWithProviders` passou a prover, causando erro de container aninhado; removido.
    - [x] Confirmar PASS
    - [x] Commit `feat(routes): add bottom tab navigator and extend test providers`
- [x] Task 5: Stack raiz e `App.tsx` [9bd08ac]
    - [x] Escrever testes falhando (`RootNavigator.test.tsx`, `App.test.tsx` atualizado)
    - [x] Implementar `RootNavigator.tsx`
    - [x] Atualizar `App.tsx`
    - [x] Confirmar PASS
    - [x] Commit `feat(routes): add root stack navigator and wire it into App`
- [ ] Task 6: Acesso temporário entre telas (Login→Main, Aulas→TrocaAluno)
    - [ ] Escrever teste falhando de ponta a ponta em `RootNavigator.test.tsx`
    - [ ] Implementar botão em `Login.tsx`
    - [ ] Implementar botão em `Aulas.tsx`
    - [ ] Confirmar PASS
    - [ ] Commit `feat(routes): add temporary navigation buttons for manual QA`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Documentação

- [ ] Task 7: README
    - [ ] Atualizar Status (e Estrutura, se necessário)
    - [ ] `yarn lint && yarn typecheck && CI=true yarn test --coverage`
    - [ ] Commit `docs: update readme with theme and navigation foundation`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md) — track concluída

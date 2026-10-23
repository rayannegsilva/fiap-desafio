# Plan: Tema e navegação (fundação)

Origem e detalhes (código, comandos, asserções): [`docs/superpowers/plans/2026-10-23-theme-navigation-foundation.md`](../../../docs/superpowers/plans/2026-10-23-theme-navigation-foundation.md). Cada task abaixo corresponde à task de mesmo número lá. Seguir `conductor/workflow.md`.

## Phase 1: Tema

- [x] Task 1: Paleta e tema Restyle [f999e46]
    - [x] Escrever testes falhando (`theme.test.ts`: tokens de cor, 14 variantes + `defaults`, `bodyStrong`)
    - [x] Implementar `palette.ts` (11 tokens de cor, dark/light)
    - [x] Implementar `theme.ts` (`createTheme`, spacing, borderRadii, textVariants)
    - [x] Confirmar PASS
    - [x] Commit `feat(theme): add restyle dark and light themes`
- [ ] Task 2: Store de tema persistida + hook `useAppTheme`
    - [ ] Escrever teste falhando da store (`useThemeStore.test.ts`: default dark, toggle + persistência)
    - [ ] Implementar `useThemeStore.ts` (Zustand + persist + AsyncStorage)
    - [ ] Confirmar PASS
    - [ ] Escrever teste falhando do hook (`useAppTheme.test.tsx`)
    - [ ] Implementar `useAppTheme.ts`
    - [ ] Confirmar PASS
    - [ ] Commit `feat(theme): add persisted theme store and useAppTheme hook`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Navegação

- [ ] Task 3: `Box`/`Text` tipados, tipos de rota e telas placeholder
    - [ ] Escrever testes falhando das 4 telas (`Login`, `Aulas`, `Boletim`, `TrocaAluno`)
    - [ ] Implementar `src/theme/restyle.ts` (`Box`, `Text`)
    - [ ] Implementar `routes/types.ts` (`RootStackParamList`, `MainTabParamList`)
    - [ ] Implementar as 4 telas placeholder
    - [ ] Confirmar PASS
    - [ ] Commit `feat(routes): add typed route params and placeholder screens`
- [ ] Task 4: `renderWithProviders` estendido e bottom-tabs
    - [ ] Escrever teste falhando do `MainTabNavigator` (cor dos ícones ativa/inativa, troca de aba)
    - [ ] Implementar `AppProviders.tsx` e atualizar `renderWithProviders.tsx`
    - [ ] Implementar `MainTabNavigator.tsx`
    - [ ] Confirmar PASS
    - [ ] Commit `feat(routes): add bottom tab navigator and extend test providers`
- [ ] Task 5: Stack raiz e `App.tsx`
    - [ ] Escrever testes falhando (`RootNavigator.test.tsx`, `App.test.tsx` atualizado)
    - [ ] Implementar `RootNavigator.tsx`
    - [ ] Atualizar `App.tsx`
    - [ ] Confirmar PASS
    - [ ] Commit `feat(routes): add root stack navigator and wire it into App`
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

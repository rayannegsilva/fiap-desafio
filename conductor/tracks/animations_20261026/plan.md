# Plan: Animações de entrada e saída

Origem e detalhes: [`docs/superpowers/plans/2026-10-26-animacoes.md`](../../../docs/superpowers/plans/2026-10-26-animacoes.md). Cada task abaixo corresponde à task de mesmo número lá. Seguir `conductor/workflow.md`.

## Phase 1: Base e transições de tela

- [ ] Task 1: Tokens de movimento
    - [ ] Testes (`exit < transition`, curvas definidas)
    - [ ] `motion.duration.exit`, `motion.easing`; usos locais passam a usar os tokens
    - [ ] Commit `feat(motion): add exit duration and easing tokens`
- [ ] Task 2: Fade entre telas e entre abas
    - [ ] Testes das opções de navegação
    - [ ] `RootNavigator` e `MainTabNavigator` com `animation: 'fade'`
    - [ ] Commit `feat(navigation): fade between screens and tabs`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Componentes

- [ ] Task 3: Collapsible fechando suave
    - [ ] Teste de alternância rápida
    - [ ] Curva de abrir no fechar, opacidade do conteúdo junto da altura
    - [ ] Commit `fix(collapsible): close as smoothly as it opens`
- [ ] Task 4: Dropdown com deslocamento
    - [ ] Entrada/saída do painel com fade + 8pt
    - [ ] Commit `feat(dropdown): slide the panel in and out`
- [ ] Task 5: Saída do modal
    - [ ] Testes (desmonta após a saída, reabrir no meio, reduzir movimento, `signOut` após a saída)
    - [ ] `ConfirmDialog` com `mounted` + `onClosed`; `Header` desloga em `onClosed`
    - [ ] Commit `feat(confirm-dialog): animate the dialog out before closing`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Conteúdo

- [ ] Task 6: Listas, cabeçalho e login
    - [ ] Listas e `EmptyDay` com `exiting`; `StudentSummary` com fade cruzado; erro do `TextField` e `PrimaryButton` com fade
    - [ ] `yarn lint && yarn typecheck && CI=true yarn test --coverage` PASS
    - [ ] Commit `feat(motion): fade content in and out across screens`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md) — track concluída

# Plan: Animações de entrada e saída

Origem e detalhes: [`docs/superpowers/plans/2026-10-26-animacoes.md`](../../../docs/superpowers/plans/2026-10-26-animacoes.md). Cada task abaixo corresponde à task de mesmo número lá. Seguir `conductor/workflow.md`.

## Phase 1: Base e transições de tela [checkpoint: f1c6a07]

- [x] Task 1: Tokens de movimento 1c490c8
    - [x] Testes (`exit < transition`, curvas definidas)
    - [x] `motion.duration.exit`, `motion.easing`; usos locais passam a usar os tokens
    - [x] Commit `feat(motion): add exit duration and easing tokens`
- [x] Task 2: Fade entre telas e entre abas f1c6a07
    - [x] Testes das opções de navegação
    - [x] `RootNavigator` e `MainTabNavigator` com `animation: 'fade'`
    - [x] Commit `feat(navigation): fade between screens and tabs`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Componentes [checkpoint: 12ed22f]

- [x] Task 3: Collapsible fechando suave d4bb237
    - [x] Teste de alternância rápida
    - [x] Curva de abrir no fechar, opacidade do conteúdo junto da altura
    - [x] Commit `fix(collapsible): close as smoothly as it opens`
- [x] Task 4: Dropdown com deslocamento 42546f3
    - [x] Entrada/saída do painel com fade + 8pt
    - [x] Commit `feat(dropdown): slide the panel in and out`
- [x] Task 5: Saída do modal 12ed22f
    - [x] Testes (desmonta após a saída, reabrir no meio, reduzir movimento, `signOut` após a saída)
    - [x] `ConfirmDialog` com `mounted` + `onClosed`; `Header` desloga em `onClosed`
    - [x] Commit `feat(confirm-dialog): animate the dialog out before closing`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Conteúdo

- [ ] Task 6: Listas, cabeçalho e login
    - [ ] Listas e `EmptyDay` com `exiting`; `StudentSummary` com fade cruzado; erro do `TextField` e `PrimaryButton` com fade
    - [ ] `yarn lint && yarn typecheck && CI=true yarn test --coverage` PASS
    - [ ] Commit `feat(motion): fade content in and out across screens`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md) — track concluída

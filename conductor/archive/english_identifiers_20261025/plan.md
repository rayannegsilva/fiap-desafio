# Plan: Identificadores em inglês e código sem comentários

Origem e detalhes (regras, mapa de nomes, comandos): [`docs/superpowers/plans/2026-10-25-english-identifiers.md`](../../../docs/superpowers/plans/2026-10-25-english-identifiers.md). Cada task abaixo corresponde à task de mesmo número lá. Seguir `conductor/workflow.md`. Pré-requisito: track Boletim arquivada.

## Phase 1: Refactor [checkpoint: 1dc94b1]

- [x] Task 1: Dados e sessão [a10f822]
    - [x] Renomear tipos, repositório, store e `useSession` + consumidores
    - [x] `yarn lint && yarn typecheck && CI=true yarn test` PASS
    - [x] Commit `refactor: use english names for data and session`
- [x] Task 2: Utilitários [5cef0c5]
    - [x] `schedule.ts` e `reportCard.ts` + funções
    - [x] Verificação completa PASS
    - [x] Commit `refactor: use english names for schedule and report card helpers`
- [x] Task 3: Telas e rotas [3cf2b9e]
    - [x] Pastas `Schedule`, `ReportCard`, `StudentSwitch`, componentes, hooks, rotas
    - [x] Verificação completa PASS
    - [x] Commit `refactor: use english names for screens and routes`
- [x] Task 4: Sem comentários e varredura final [6b6f441]
    - [x] Remover comentários de `src/`
    - [x] Varreduras vazias
    - [x] Verificação completa PASS
    - [x] Commit `refactor: remove inline comments`
- [x] Task 5: README [1dc94b1]
    - [x] Atualizar Estrutura
    - [x] `yarn lint && yarn typecheck && CI=true yarn test --coverage`
    - [x] Commit `docs: update readme structure with english names`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) — track concluída

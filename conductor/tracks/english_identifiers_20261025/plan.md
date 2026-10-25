# Plan: Identificadores em inglês e código sem comentários

Origem e detalhes (regras, mapa de nomes, comandos): [`docs/superpowers/plans/2026-10-25-english-identifiers.md`](../../../docs/superpowers/plans/2026-10-25-english-identifiers.md). Cada task abaixo corresponde à task de mesmo número lá. Seguir `conductor/workflow.md`. Pré-requisito: track Boletim arquivada.

## Phase 1: Refactor

- [x] Task 1: Dados e sessão [a10f822]
    - [x] Renomear tipos, repositório, store e `useSession` + consumidores
    - [x] `yarn lint && yarn typecheck && CI=true yarn test` PASS
    - [x] Commit `refactor: use english names for data and session`
- [ ] Task 2: Utilitários
    - [ ] `schedule.ts` e `reportCard.ts` + funções
    - [ ] Verificação completa PASS
    - [ ] Commit `refactor: use english names for schedule and report card helpers`
- [ ] Task 3: Telas e rotas
    - [ ] Pastas `Schedule`, `ReportCard`, `StudentSwitch`, componentes, hooks, rotas
    - [ ] Verificação completa PASS
    - [ ] Commit `refactor: use english names for screens and routes`
- [ ] Task 4: Sem comentários e varredura final
    - [ ] Remover comentários de `src/`
    - [ ] Varreduras vazias
    - [ ] Verificação completa PASS
    - [ ] Commit `refactor: remove inline comments`
- [ ] Task 5: README
    - [ ] Atualizar Estrutura
    - [ ] `yarn lint && yarn typecheck && CI=true yarn test --coverage`
    - [ ] Commit `docs: update readme structure with english names`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md) — track concluída

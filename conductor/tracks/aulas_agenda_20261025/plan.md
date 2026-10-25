# Plan: Agenda de aulas

Origem e detalhes (medidas do Figma, interfaces, testes, comandos): [`docs/superpowers/plans/2026-10-25-aulas-agenda.md`](../../../docs/superpowers/plans/2026-10-25-aulas-agenda.md). Cada task abaixo corresponde à task de mesmo número lá. Seguir `conductor/workflow.md`.

## Phase 1: Lógica da agenda [checkpoint: 697a8f9]

- [x] Task 1: Utilitários de data da agenda [e0591ed]
    - [x] Escrever testes falhando (rótulos de domingo/segunda/sábado/janeiro, dia inicial por dia da semana, fallback e agenda vazia)
    - [x] Implementar `src/utils/agenda.ts` (`formatDayLabel`, `initialDay`)
    - [x] Confirmar PASS
    - [x] Commit `feat(agenda): add day label and initial day helpers`
- [x] Task 2: `useAgenda` [697a8f9]
    - [x] Escrever testes falhando (dia inicial, selecionar dia, manter dia ao trocar de aluno)
    - [x] Implementar `src/screens/Aulas/useAgenda.ts` e `motion.stagger`
    - [x] Confirmar PASS
    - [x] Commit `feat(agenda): add agenda hook with day selection`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Tela

- [x] Task 3: Item de aula e estado vazio [53abc70]
    - [x] Escrever testes falhando
    - [x] Implementar `AulaItem` e `SemAulas`
    - [x] Confirmar PASS
    - [x] Commit `feat(agenda): add class item and empty day components`
- [ ] Task 4: Tela de Aulas
    - [ ] Escrever testes falhando (aulas do dia de hoje, trocar dia pelo dropdown → vazio)
    - [ ] Implementar `Aulas.tsx`
    - [ ] `yarn lint && yarn typecheck && CI=true yarn test` PASS
    - [ ] Commit `feat(agenda): show student schedule with day selection`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Documentação

- [ ] Task 5: README
    - [ ] Atualizar Estrutura e Status
    - [ ] `yarn lint && yarn typecheck && CI=true yarn test --coverage`
    - [ ] Commit `docs: update readme with class schedule`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md) — track concluída

# Plan: Boletim

Origem e detalhes (medidas do Figma, interfaces, testes, comandos): [`docs/superpowers/plans/2026-10-25-boletim.md`](../../../docs/superpowers/plans/2026-10-25-boletim.md). Cada task abaixo corresponde à task de mesmo número lá. Seguir `conductor/workflow.md`.

## Phase 1: Lógica do boletim [checkpoint: 0d798e9]

- [x] Task 1: Formatadores do boletim [adf5e89]
    - [x] Escrever testes falhando (nota inteira/decimal/null, faltas 0/null, rótulos)
    - [x] Implementar `src/utils/boletim.ts`
    - [x] Confirmar PASS
    - [x] Commit `feat(boletim): add report card formatters`
- [x] Task 2: `useBoletim` [0d798e9]
    - [x] Escrever testes falhando (ano mais recente e ordem, trocar ano, voltar ao mais recente ao trocar de aluno)
    - [x] Implementar `src/screens/Boletim/useBoletim.ts`
    - [x] Confirmar PASS
    - [x] Commit `feat(boletim): add report card hook with year selection`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Tela

- [x] Task 3: Dropdown estático com uma opção [3eb4850]
    - [x] Escrever teste falhando
    - [x] Implementar em `Dropdown.tsx`
    - [x] Confirmar PASS (agenda intacta)
    - [x] Commit `feat(dropdown): render a static box for a single option`
- [x] Task 4: Detalhe da disciplina [399eed0]
    - [x] Escrever testes falhando (nota/faltas, traços sem avaliação)
    - [x] Implementar `DisciplinaDetalhe`
    - [x] Confirmar PASS
    - [x] Commit `feat(boletim): add subject grade details`
- [x] Task 5: Tela de Boletim [26a87e8]
    - [x] Escrever testes falhando (ano recente e trimestres fechados, abrir trimestre/disciplina, trocar ano, caixa estática)
    - [x] Implementar `Boletim.tsx`
    - [x] `yarn lint && yarn typecheck && CI=true yarn test` PASS
    - [x] Commit `feat(boletim): show report card with trimesters and subjects`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Documentação

- [ ] Task 6: README
    - [ ] Atualizar Estrutura e Status
    - [ ] `yarn lint && yarn typecheck && CI=true yarn test --coverage`
    - [ ] Commit `docs: update readme with report card`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md) — track concluída

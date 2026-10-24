# Plan: Componentes base

Origem e detalhes (código, testes, comandos): [`docs/superpowers/plans/2026-10-24-base-components.md`](../../../docs/superpowers/plans/2026-10-24-base-components.md). Cada task abaixo corresponde à task de mesmo número lá. Seguir `conductor/workflow.md`.

## Phase 1: Fundamentos

- [ ] Task 1: `Text`
    - [ ] Escrever testes falhando (variante padrão, `maxFontSizeMultiplier`, props nativos)
    - [ ] Implementar `src/components/Text/Text.tsx`; trocar import de `Text` nas 4 telas
    - [ ] Confirmar PASS
    - [ ] Commit `feat(components): add text component with dynamic font limit`
- [ ] Task 2: `motion` + `usePressScale`
    - [ ] Escrever testes falhando (escala ao pressionar; opacidade com "reduzir movimento")
    - [ ] Implementar `src/theme/motion.ts` e `src/animations/usePressScale.ts`
    - [ ] Confirmar PASS
    - [ ] Commit `feat(animations): add press scale hook and motion tokens`
- [ ] Task 3: `formatCpf`
    - [ ] Escrever testes falhando (tabela de entradas/saídas)
    - [ ] Implementar `src/utils/formatCpf.ts`
    - [ ] Confirmar PASS
    - [ ] Commit `feat(utils): add cpf mask formatter`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Botões e campo

- [ ] Task 4: `PrimaryButton`
    - [ ] Escrever testes falhando (toque, desabilitado, carregando)
    - [ ] Implementar
    - [ ] Confirmar PASS
    - [ ] Commit `feat(components): add primary button with disabled and loading states`
- [ ] Task 5: `TextButton`
    - [ ] Escrever testes falhando (toque, `hitSlop`, cor do ícone)
    - [ ] Implementar
    - [ ] Confirmar PASS
    - [ ] Commit `feat(components): add text button with optional icon`
- [ ] Task 6: `TextField`
    - [ ] Ajustar `renderWithProviders` para usar `wrapper`
    - [ ] Escrever testes falhando (label/props nativos, sublinhado, erro, sem shake com "reduzir movimento")
    - [ ] Implementar
    - [ ] Confirmar PASS
    - [ ] Commit `feat(components): add text field with underline and error state`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Abre/fecha

- [ ] Task 7: `Collapsible`
    - [ ] Escrever testes falhando (abre/fecha, `defaultExpanded`, aninhado)
    - [ ] Implementar
    - [ ] Confirmar PASS
    - [ ] Commit `feat(components): add animated collapsible for card and row`
- [ ] Task 8: `Dropdown`
    - [ ] Escrever testes falhando (fechado, abre/seleciona/fecha, alterna)
    - [ ] Implementar
    - [ ] Confirmar PASS
    - [ ] Commit `feat(components): add generic dropdown with floating options`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 4: Documentação

- [ ] Task 9: README
    - [ ] Atualizar Estrutura e Status
    - [ ] `yarn lint && yarn typecheck && CI=true yarn test --coverage`
    - [ ] Commit `docs: update readme with base components`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md) — track concluída

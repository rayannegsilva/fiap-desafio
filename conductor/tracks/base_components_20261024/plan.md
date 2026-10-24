# Plan: Componentes base

Origem e detalhes (código, testes, comandos): [`docs/superpowers/plans/2026-10-24-base-components.md`](../../../docs/superpowers/plans/2026-10-24-base-components.md). Cada task abaixo corresponde à task de mesmo número lá. Seguir `conductor/workflow.md`.

## Phase 1: Fundamentos

- [x] Task 1: `Text` [c25d5b6]
    - [x] Escrever testes falhando (variante padrão, `maxFontSizeMultiplier`, props nativos)
    - [x] Implementar `src/components/Text/Text.tsx`; trocar import de `Text` nas 4 telas
    - [x] Confirmar PASS
    - [x] Commit `feat(components): add text component with dynamic font limit`
- [x] Task 2: `motion` + `usePressScale` [dca36f6]
    - [x] Escrever testes falhando (escala ao pressionar; opacidade com "reduzir movimento")
    - [x] Implementar `src/theme/motion.ts` e `src/animations/usePressScale.ts`
    - [x] Confirmar PASS
    - [x] Commit `feat(animations): add press scale hook and motion tokens`
    - **Desvio:** o mock parcial de `react-native-reanimated` precisou de `__esModule: true` (senão `Animated` default vem `undefined`). A mola não assenta exatamente em 0.96 (limiar de repouso), então o teste lê `getAnimatedStyle` e compara com `toBeCloseTo` em vez de `toHaveAnimatedStyle` exato para a escala. Tipos do `getAnimatedStyle`/matchers do Reanimated só existem nos `.d.ts` `.native`; `tsconfig.json` ganhou `moduleSuffixes: [".native", ""]`.
- [x] Task 3: `formatCpf` [469e58a]
    - [x] Escrever testes falhando (tabela de entradas/saídas)
    - [x] Implementar `src/utils/formatCpf.ts`
    - [x] Confirmar PASS
    - [x] Commit `feat(utils): add cpf mask formatter`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) [checkpoint: 469e58a]
    - **Verificação manual:** telas (Login, Aulas, Boletim, Troca de aluno) inalteradas com o novo `Text`, confirmado pelo usuário.

## Phase 2: Botões e campo

- [x] Task 4: `PrimaryButton` [bef19c7]
    - [x] Escrever testes falhando (toque, desabilitado, carregando)
    - [x] Implementar
    - [x] Confirmar PASS
    - [x] Commit `feat(components): add primary button with disabled and loading states`
- [x] Task 5: `TextButton` [022d453]
    - [x] Escrever testes falhando (toque, `hitSlop`, cor do ícone)
    - [x] Implementar
    - [x] Confirmar PASS
    - [x] Commit `feat(components): add text button with optional icon`
- [x] Task 6: `TextField` [fa033aa]
    - [x] Ajustar `renderWithProviders` para usar `wrapper`
    - [x] Escrever testes falhando (label/props nativos, sublinhado, erro, sem shake com "reduzir movimento")
    - [x] Implementar
    - [x] Confirmar PASS
    - [x] Commit `feat(components): add text field with underline and error state`
    - **Desvio:** RNTL 14 não tem `toHaveAccessibilityState` (Task 4 usa `toBeBusy`). Adicionado teste de que o campo sacode sem "reduzir movimento"; alinhamento do input movido para `StyleSheet` (commit separado) para zerar o warning de lint.
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

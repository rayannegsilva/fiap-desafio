# Animações de entrada e saída — Implementation Plan

> **Para agentes executores:** este plano é registrado como track via `conductor-new-track` e executado com `conductor-implement` (num subagente), seguindo `conductor/workflow.md` (um commit por task com resumo de 3–5 linhas no corpo, SHA no `plan.md` da track). Steps usam checkbox (`- [ ]`).

**Goal:** Dar entrada e saída suaves e discretas a todos os momentos do app (telas, abas, listas, collapsible, dropdown, modal, cabeçalho, login), corrigindo o fechamento brusco do `Collapsible`.

**Architecture:** Tempos e curvas centralizados em `motion` (tema). Transições de tela pelo React Navigation (`animation: 'fade'`); o resto com Reanimated — layout animations (`entering`/`exiting`) onde o elemento monta/desmonta, shared values onde o elemento precisa ficar montado durante a saída (modal) ou já existe (collapsible).

**Tech Stack:** Reanimated 4, React Navigation 7 (native-stack, bottom-tabs) — instalados.

**Spec:** decisões do usuário (2026-10-26): sensação **suave e discreta**; lista de momentos aprovada ("é isso mesmo"). `conductor/product-guidelines.md` → Animações (100–200ms micro, 250–400ms transições, ease-out entrando, ease-in saindo, reduzir movimento).

## Regras de movimento

| Item | Valor |
|---|---|
| Movimento | Só opacidade e deslocamento curto (8–16pt) e escala mínima (0,96); sem quique, sem spring fora do toque |
| Entrada | `motion.duration.transition` (300ms), `motion.easing.enter` = `Easing.out(Easing.cubic)` |
| Saída | `motion.duration.exit` = 200ms (mais rápida que a entrada), `motion.easing.exit` = `Easing.in(Easing.quad)` |
| Micro | `motion.duration.micro` (150ms) |
| Reduzir movimento | Só fade, ou nada; layout animations do Reanimated já respeitam o sistema (`ReduceMotion.System`); animações manuais checam `useReducedMotion()` |

## Mapa de momentos

| Momento | Hoje | Depois |
|---|---|---|
| Login → Agenda, Sair → Login | troca seca | fade entre telas (`animation: 'fade'`) |
| Trocar de aba | troca seca + cascata | fade entre abas (bottom-tabs `animation: 'fade'`), cascata mantida |
| Trocar dia/ano/aluno | lista some de uma vez | lista antiga sai com `FadeOut` (`exit`), nova entra em cascata |
| Collapsible | abre ok, fecha brusco | fecha com a mesma curva suave de abrir; conteúdo esmaece junto com a altura |
| Dropdown | fade 150ms | fade + 8pt (de cima para baixo) ao abrir; inverso ao fechar |
| Modal de saída | entra com fade/escala, some seco | sai: fundo esmaece, card volta a 0,96 e esmaece; só então desmonta |
| Troca de aluno (tela) | sobe/desce | igual (sem mudança) |
| Cabeçalho ao trocar aluno | troca seca | fade cruzado do nome e da linha da turma |
| Login: erro e carregando | erro com tremor, aparece seco | erro com fade (entrada e saída) além do tremor; indicador com fade |

## Global Constraints

- **Sem comentários no código**; identificadores em inglês; `StyleSheet` no fim do arquivo; só tokens do tema/`motion`.
- Animar só `transform` e `opacity` (exceto a altura do `Collapsible`, que já existe).
- Interação nunca bloqueada por animação (toques continuam funcionando durante a saída, exceto o modal enquanto fecha).
- RNTL 14 assíncrono; testes ao lado do código; layout animations não rodam no Jest — testar comportamento (montagem/desmontagem, callbacks, props de config), não pixels.
- Commits Conventional Commits, subject minúsculo, corpo 3–5 linhas, **sem `Co-Authored-By` ou atribuição**. Nunca adicionar `docs/superpowers/plans/` nem as mudanças locais de `ios/FiapTeste.xcodeproj/project.pbxproj` e `ios/FiapTeste/Info.plist`.

## Review Focus

1. **Modal fechando e reabrindo rápido** (SAIR → CANCELAR → SAIR em sequência) → não fica preso invisível nem duplica. Teste na Task 5.
2. **Confirmar saída** → `signOut` só depois da animação de saída do modal, sem tela piscando. Teste na Task 5.
3. **Abrir e fechar o collapsible rápido** → sem salto de altura nem conteúdo sobreposto (verificação manual na Fase 2).
4. **Trocar de dia rápido várias vezes** → listas fantasmas não se acumulam (verificação manual na Fase 2).
5. **Reduzir movimento** → nenhuma animação com deslocamento; telas e modal aparecem/somem com fade ou direto. Testes nas Tasks 5 e 6.

---

## Fase 1: Base e transições de tela

### Task 1: Tokens de movimento

**Files:** `src/theme/motion.ts`, `src/theme/motion.test.ts`

- [ ] Adicionar `duration.exit: 200` e `easing: { enter, exit }` (funções `Easing` do Reanimated). Teste: `exit < transition` e as duas curvas definidas.
- [ ] Trocar usos locais de curva (`OPEN_EASING`/`CLOSE_EASING` no `Collapsible`, `Easing.out(...)` soltos) por `motion.easing` onde o significado bater; sem mudar comportamento nesta task.
- [ ] `yarn lint && yarn typecheck && CI=true yarn test` → PASS.
- [ ] Commit `feat(motion): add exit duration and easing tokens`

### Task 2: Fade entre telas e entre abas

**Files:** `src/routes/RootNavigator.tsx`, `src/routes/MainTabNavigator.tsx` (+ testes)

- [ ] `RootNavigator`: `Login` e `Main` com `animation: 'fade'` (e `animationTypeForReplace` coerente), `StudentSwitch` mantém `slide_from_bottom`.
- [ ] `MainTabNavigator`: `animation: 'fade'` nas `screenOptions` (bottom-tabs 7).
- [ ] Testes: as opções estão configuradas (e2e do `RootNavigator` continua passando).
- [ ] Verificação completa → PASS. Commit `feat(navigation): fade between screens and tabs`

- [ ] **Task: Phase Verification & Checkpoint** — manual iOS/Android: login → agenda, sair → login, abas.

## Fase 2: Componentes

### Task 3: Collapsible fechando suave

**Files:** `src/components/Collapsible/Collapsible.tsx` (+ teste)

- [ ] Fechar com a mesma curva de abrir (`motion.easing.enter`), duração `transition`; opacidade do conteúdo 1 → 0 acompanhando a altura ao fechar e 0 → 1 ao abrir (animated style no conteúdo); chevron sincronizado.
- [ ] Reduzir movimento continua instantâneo.
- [ ] Testes existentes passam; teste novo: alternar duas vezes rápido termina no estado certo (aberto/fechado pelo `accessibilityState.expanded`).
- [ ] Commit `fix(collapsible): close as smoothly as it opens`

### Task 4: Dropdown com deslocamento

**Files:** `src/components/Dropdown/Dropdown.tsx` (+ teste)

- [ ] Painel entra com fade + `translateY` de −8 → 0 (`motion.duration.micro`, `enter`) e sai com o inverso (`exit`), via `entering`/`exiting` customizados (`Keyframe` ou `withInitialValues`).
- [ ] Testes existentes passam.
- [ ] Commit `feat(dropdown): slide the panel in and out`

### Task 5: Saída do modal

**Files:** `src/components/ConfirmDialog/ConfirmDialog.tsx` (+ teste), `src/components/Header/Header.tsx` (+ teste)

**Interfaces:** `ConfirmDialog` mantém a API; internamente guarda `mounted` (estado) separado de `visible`: ao `visible` virar `false`, anima fundo (opacidade → 0) e card (opacidade → 0, escala → 0,96) com `exit`, e só desmonta o `Modal` no fim (`runOnJS`). Reabrir durante a saída cancela a saída e volta ao estado aberto.

- [ ] `Header`: confirmar fecha o modal e chama `signOut` **depois** da saída (callback `onClosed?: () => void` no `ConfirmDialog`, chamado ao terminar de desmontar).
- [ ] Testes (fake timers + `jest.advanceTimersByTime` com o mock do Reanimated): após `visible=false` o modal ainda está montado e desmonta após `exit`; reabrir no meio mantém montado; com reduzir movimento desmonta imediatamente; confirmar chama `signOut` só após a saída.
- [ ] Commit `feat(confirm-dialog): animate the dialog out before closing`

- [ ] **Task: Phase Verification & Checkpoint** — manual: collapsible abre/fecha rápido sem salto; dropdown; modal abre/cancela/confirma, abrir e cancelar em sequência.

## Fase 3: Conteúdo

### Task 6: Listas, cabeçalho e login

**Files:** `src/screens/Schedule/Schedule.tsx`, `src/screens/Schedule/EmptyDay.tsx`, `src/screens/ReportCard/ReportCardContent.tsx`, `src/components/StudentSummary/StudentSummary.tsx`, `src/components/TextField/TextField.tsx`, `src/components/PrimaryButton/PrimaryButton.tsx` (+ testes)

- [ ] Listas: o container chaveado (dia em `Schedule`; ano/aluno em `ReportCardContent`) vira `Animated.View` com `exiting={FadeOut.duration(motion.duration.exit)}`; `EmptyDay` ganha `exiting` igual. A cascata de entrada (`useFocusEntrance`) continua.
- [ ] `StudentSummary`: nome do aluno e linha da turma em `Animated.View` com `key={student.rm}`, `entering={FadeIn.duration(transition)}` e `exiting={FadeOut.duration(exit)}` (fade cruzado).
- [ ] `TextField`: mensagem de erro com `entering={FadeIn}` / `exiting={FadeOut}` (tremor mantido).
- [ ] `PrimaryButton`: indicador de carregando e rótulo trocam com fade (`micro`).
- [ ] Testes existentes passam; testes novos só onde há comportamento (ex.: erro some ao editar o campo continua funcionando).
- [ ] `yarn lint && yarn typecheck && CI=true yarn test --coverage` → PASS.
- [ ] Commit `feat(motion): fade content in and out across screens`

- [ ] **Task: Phase Verification & Checkpoint** — manual iOS/Android: trocar dia/ano/aluno (inclusive rápido, sem fantasmas), cabeçalho ao trocar aluno, erro e carregando no login, reduzir movimento ligado; track concluída.

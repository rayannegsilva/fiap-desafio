# Plan: Ajustes posteriores e tema automático

Origem e detalhes: [`docs/superpowers/plans/2026-10-26-followups.md`](../../../docs/superpowers/plans/2026-10-26-followups.md). Cada task abaixo corresponde à task de mesmo número lá. Seguir `conductor/workflow.md`.

## Phase 1: Registro dos ajustes entregues

- [x] Task 1: Troca de aluno com skeleton 95d994b
    - [x] Aceite: aluno pressionado destacado na hora; troca só após o fim da transição de saída; skeleton pulsante por no mínimo 300 ms em `Schedule` e `ReportCard`; cascata de entrada só em troca de aba
    - [x] Validação: testes de `StudentSwitch`, `useSessionStore`, `Skeleton`, `Schedule`, `ReportCard`
- [x] Task 2: Entrada no primeiro foco de aba pré-carregada 7f5d040
    - [x] Aceite: termos do boletim visíveis após o primeiro foco, sem blur prévio
    - [x] Validação: `useFocusEntrance.test.tsx` sem blur anterior
- [x] Task 3: Dropdown sem queda de frames no Android f933715
    - [x] Aceite: painel só desliza; fade nas opções; painel some com fade na saída
    - [x] Validação: `Dropdown.test.tsx`
- [x] Task 4: Collapsible sem travar no Android d41c92f
    - [x] Aceite: opacidade com valor compartilhado próprio; some mais rápido que a altura ao fechar
    - [x] Validação: `Collapsible.test.tsx`
- [x] Task 5: Splash encerra o desenho pelo callback da animação 89df5a1
    - [x] Aceite: flag de fim do desenho definida no callback do `withTiming`, sem `setTimeout`
    - [x] Validação: `SplashOverlay.test.tsx`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Tema automático e tema da navegação

- [x] Task 6: Tema segue só o sistema `7a2fed3`
    - [x] Ajustar `useAppTheme.test.tsx` (sem `useThemeStore`)
    - [x] `useResolvedScheme` lê só `useColorScheme()`; remover `useThemeStore.ts`, seu teste e a linha do `README.md`
    - [x] `yarn lint && yarn typecheck && CI=true yarn test --coverage` PASS
    - [x] Commit `refactor(theme): follow the system scheme only`
- [x] Task 7: Sincronizar NavigationContainer com o tema Restyle `668ca5a`
    - [x] Testes (`useNavigationTheme.test.tsx`: `dark` e cores por esquema, sem preferência = escuro, troca ao vivo)
    - [x] `useNavigationTheme()` e `AppProviders` com `theme`
    - [x] `yarn lint && yarn typecheck && CI=true yarn test --coverage` PASS
    - [x] Commit `fix(navigation): follow the app theme in the navigation container`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

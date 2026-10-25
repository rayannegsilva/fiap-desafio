# Plan: Tema do sistema e splash animada

Origem e detalhes (decisões, tempos, interfaces, testes): [`docs/superpowers/plans/2026-10-25-splash.md`](../../../docs/superpowers/plans/2026-10-25-splash.md). Cada task abaixo corresponde à task de mesmo número lá. Seguir `conductor/workflow.md`.

## Phase 1: Tema do sistema e splash nativa

- [ ] Task 0: Tema segue o sistema
    - [ ] Escrever testes falhando (padrão `system`, override manual, troca ao vivo)
    - [ ] Implementar `useThemeStore` (`mode`/`setMode`), `useAppTheme`, `useResolvedScheme`, `StatusBar`; atualizar guidelines
    - [ ] Confirmar PASS
    - [ ] Commit `feat(theme): follow the system color scheme`
- [ ] Task 1: Splash nativa no modo do sistema
    - [ ] iOS LaunchScreen `systemBackgroundColor` sem labels
    - [ ] Android `values`/`values-night` + Android 12+ sem ícone
    - [ ] Verificação completa PASS
    - [ ] Commit `feat(splash): native launch screen follows the system scheme`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Splash animada

- [ ] Task 2: Logo vetorial com desenho
    - [ ] Exportar SVG do Figma (`4001:4`) e derivar linhas centrais
    - [ ] Escrever testes falhando
    - [ ] Implementar `FiapStrokeLogo` e `motion.splash`
    - [ ] Confirmar PASS
    - [ ] Commit `feat(splash): add stroke-drawn fiap logo`
- [ ] Task 3: Overlay da splash e saídas
    - [ ] Escrever testes falhando (esperar reidratação, terminar desenho, Login com handoff, Aulas com fade, reduzir movimento, bloquear toques)
    - [ ] Implementar `SplashOverlay`, `loginLayout`, `App`
    - [ ] `yarn lint && yarn typecheck && CI=true yarn test` PASS
    - [ ] Commit `feat(splash): animate the logo into the first screen`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Documentação

- [ ] Task 4: README
    - [ ] Atualizar Estrutura e Status
    - [ ] `yarn lint && yarn typecheck && CI=true yarn test --coverage`
    - [ ] Commit `docs: update readme with animated splash`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md) — track concluída

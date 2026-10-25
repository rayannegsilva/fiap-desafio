# Plan: Tema do sistema e splash animada

Origem e detalhes (decisões, tempos, interfaces, testes): [`docs/superpowers/plans/2026-10-25-splash.md`](../../../docs/superpowers/plans/2026-10-25-splash.md). Cada task abaixo corresponde à task de mesmo número lá. Seguir `conductor/workflow.md`.

## Phase 1: Tema do sistema e splash nativa [checkpoint: e129412]

- [x] Task 0: Tema segue o sistema b640f0b
    - [x] Escrever testes falhando (padrão `system`, override manual, troca ao vivo)
    - [x] Implementar `useThemeStore` (`mode`/`setMode`), `useAppTheme`, `useResolvedScheme`, `StatusBar`; atualizar guidelines
    - [x] Confirmar PASS
    - [x] Commit `feat(theme): follow the system color scheme`
- [x] Task 1: Splash nativa no modo do sistema e129412
    - [x] iOS LaunchScreen `systemBackgroundColor` sem labels
    - [x] Android `values`/`values-night` + Android 12+ sem ícone
    - [x] Verificação completa PASS
    - [x] Commit `feat(splash): native launch screen follows the system scheme`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Splash animada

- [x] Task 2: Logo vetorial com desenho 231db4a
    - [x] Exportar SVG do Figma (`4001:4`) e derivar linhas centrais
    - [x] Escrever testes falhando
    - [x] Implementar `FiapStrokeLogo` e `motion.splash`
    - [x] Confirmar PASS
    - [x] Commit `feat(splash): add stroke-drawn fiap logo`
- [x] Task 3: Overlay da splash e saídas 88aa246
    - [x] Escrever testes falhando (esperar reidratação, terminar desenho, Login com handoff, Aulas com fade, reduzir movimento, bloquear toques)
    - [x] Implementar `SplashOverlay`, `loginLayout`, `App`
    - [x] `yarn lint && yarn typecheck && CI=true yarn test` PASS
    - [x] Commit `feat(splash): animate the logo into the first screen`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) [checkpoint: bfcfd5f]
    - **Verificação manual:** iOS (aparelho) e Android (emulador) — desenho do FIAP, viagem até o Login (plano B não foi necessário), fade para Aulas com sessão, sessão corrompida cai no Login. Confirmado pelo usuário.
    - **Desvio (traços) [987ef09, 61d904d, 2e04a64, d19b8af]:** ajustes no `FiapStrokeLogo` vistos no aparelho — entalhe da perna do A, bojo do P fora da área do A, cantos do F e do P, e retângulos do recorte sem sobreposição (a haste do P sumia com preenchimento par/ímpar).
    - **Desvio (tempos) [d19b8af, 11944f6]:** desenho e viagem mais lentos por decisão de UX (Login ≈ 2,6 s); spec, plano e guidelines passam a "até 2,7 s, validada em dispositivo", com teste do limite.
    - **Desvio (reidratação) [87a979f]:** storage corrompido deixava a splash presa; a store marca `hydrated` também no erro e cai no Login.

## Phase 3: Documentação

- [x] Task 4: README a68976e
    - [x] Atualizar Estrutura e Status
    - [x] `yarn lint && yarn typecheck && CI=true yarn test --coverage`
    - [x] Commit `docs: update readme with animated splash`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md) — track concluída

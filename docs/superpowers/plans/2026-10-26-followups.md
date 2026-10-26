# Ajustes posteriores e tema automático — Implementation Plan

> **Para agentes executores:** este plano é registrado como track via `conductor-new-track` e executado com `conductor-implement` (num subagente), seguindo `conductor/workflow.md` (um commit por task com resumo de 3–5 linhas no corpo, SHA no `plan.md` da track). Steps usam checkbox (`- [ ]`).

**Goal:** Registrar na rastreabilidade SDD os ajustes entregues depois do fechamento de `animations_20261026`, fazer o tema seguir apenas o sistema e sincronizar o tema do `NavigationContainer` com o tema Restyle.

**Architecture:** O tema é resolvido por `useResolvedScheme()` lendo só `useColorScheme()`. Um hook `useNavigationTheme()` deriva o tema do React Navigation do esquema ativo e da paleta Restyle, e `AppProviders` o repassa ao `NavigationContainer`. A store de modo manual é removida.

**Tech Stack:** React Native, `@shopify/restyle`, `@react-navigation/native`, Jest + `@testing-library/react-native`.

## Global Constraints

- O tema segue o modo do sistema, inclusive trocas com o app aberto; não há botão de troca manual (`conductor/product-guidelines.md:16-20`).
- Sem preferência do sistema, o tema é escuro.
- Toda cor vem do tema Restyle; nenhum valor fixo em componentes.
- Sem comentários no código-fonte; a justificativa vai no corpo do commit.
- `@react-native-async-storage/async-storage` permanece: `useSessionStore` o usa.
- Gate de cada task: `yarn lint && yarn typecheck && CI=true yarn test --coverage` passando.

## Review Focus

- Sistema sem preferência (`useColorScheme()` retorna `null`): navegação escura, como o Restyle.
- Troca do sistema com o app aberto: tema de navegação acompanha sem remontar.
- Instalação antiga com `theme-storage` persistido: ignorado, sem erro.
- Fundo da cena exposto no fade entre abas: usa `colors.background` do tema, não o cinza claro padrão.

---

## Phase 1: Registro dos ajustes entregues

Só documentação da track: o código já existe nos commits abaixo. Cada task do `plan.md` da track registra critérios de aceite, SHA e validação a partir da mensagem do commit.

### Task 1: Troca de aluno com skeleton (`95d994b`)

- Aceite: aluno pressionado destacado na hora; troca só após o fim da transição de saída; `Schedule` e `ReportCard` mostram skeleton pulsante por no mínimo 300 ms; cascata de entrada só em troca de aba, não ao voltar da troca de aluno.
- Validação: testes de `StudentSwitch`, `useSessionStore`, `Skeleton`, `Schedule`, `ReportCard`.

### Task 2: Entrada no primeiro foco de aba pré-carregada (`7f5d040`)

- Aceite: termos do boletim visíveis após o primeiro foco, sem depender de blur prévio.
- Validação: `useFocusEntrance.test.tsx` sem blur anterior.

### Task 3: Dropdown sem queda de frames no Android (`f933715`)

- Aceite: painel só desliza; fade aplicado às opções; painel some com fade na saída.
- Validação: `Dropdown.test.tsx`.

### Task 4: Collapsible sem travar no Android (`d41c92f`)

- Aceite: opacidade do conteúdo com valor compartilhado próprio; some mais rápido que a altura ao fechar.
- Validação: `Collapsible.test.tsx`.

### Task 5: Splash encerra o desenho pelo callback da animação (`89df5a1`)

- Aceite: flag de fim do desenho definida no callback do `withTiming`, sem `setTimeout`.
- Validação: `SplashOverlay.test.tsx`.

---

## Phase 2: Tema automático e tema da navegação

### Task 6: Tema segue só o sistema

**Files:**
- Modify: `src/theme/useAppTheme.ts`
- Modify: `src/theme/useAppTheme.test.tsx`
- Delete: `src/store/useThemeStore.ts`, `src/store/useThemeStore.test.ts`
- Modify: `README.md:85` (remover a linha de `useThemeStore.ts` da árvore)

**Interfaces:**
- Produces: `useResolvedScheme(): 'light' | 'dark'` (agora só `useColorScheme()`, `'light'` se e só se o sistema for `'light'`), `useAppTheme(): Theme` (inalterado).

- [ ] **Step 1: Ajustar o teste (red).** Em `useAppTheme.test.tsx`, remover o import e o `setState` de `useThemeStore` e o teste `ignores the system when a mode is chosen`. Manter os demais.
- [ ] **Step 2: Rodar `yarn test src/theme/useAppTheme.test.tsx`.** Esperado: PASS (o comportamento já cobre o sistema; o teste removido é o único que dependia da store). Confirmar que nenhum teste restante importa a store.
- [ ] **Step 3: Remover o modo manual.** `useResolvedScheme` passa a ser `useColorScheme() === 'light' ? 'light' : 'dark'`, sem ler a store. Apagar `useThemeStore.ts` e `useThemeStore.test.ts`; remover a linha do `README.md`.
- [ ] **Step 4: Gate completo.** `yarn lint && yarn typecheck && CI=true yarn test --coverage`. Esperado: PASS, sem referências a `useThemeStore` em `src/` e `README.md` (`grep -rn useThemeStore src README.md` vazio).
- [ ] **Step 5: Commit** `refactor(theme): follow the system scheme only`. Corpo: não há botão de troca; a store de modo manual era estado morto; preferência antiga em `theme-storage` fica ignorada.

### Task 7: Sincronizar `NavigationContainer` com o tema Restyle

**Files:**
- Create: `src/theme/useNavigationTheme.ts`
- Create: `src/theme/useNavigationTheme.test.tsx`
- Modify: `src/theme/AppProviders.tsx:15`

**Interfaces:**
- Consumes: `useResolvedScheme(): 'light' | 'dark'`, `useAppTheme(): Theme` (Task 6).
- Produces: `useNavigationTheme(): import('@react-navigation/native').Theme`.

- [ ] **Step 1: Escrever os testes (red).** `useNavigationTheme.test.tsx`, com `useColorScheme` mockado como em `useAppTheme.test.tsx`:
  - `dark` é `true` e `colors.background === '#000000'` quando o sistema é escuro ou sem preferência (`null`).
  - `dark` é `false` e `colors.background === '#FFFFFF'` quando o sistema é claro.
  - `colors.card === theme.colors.surface`, `colors.text === theme.colors.textPrimary`, `colors.primary === theme.colors.accent`, `colors.border === theme.colors.lineIdle`, `colors.notification === theme.colors.brand` em ambos os esquemas.
  - Trocar o sistema de escuro para claro com `rerender` atualiza `dark` e `background`.
- [ ] **Step 2: Rodar `yarn test src/theme/useNavigationTheme.test.tsx`.** Esperado: FAIL, módulo não existe.
- [ ] **Step 3: Implementar `useNavigationTheme(): NavigationTheme`.** Base `DarkTheme` ou `DefaultTheme` conforme `useResolvedScheme()` (preserva `fonts`), sobrescrevendo `colors` com o mapeamento do Step 1. `useMemo` por esquema para identidade estável.
- [ ] **Step 4: Usar em `AppProviders`.** `<NavigationContainer theme={navigationTheme}>`.
- [ ] **Step 5: Rodar o teste.** Esperado: PASS.
- [ ] **Step 6: Gate completo.** `yarn lint && yarn typecheck && CI=true yarn test --coverage`. Esperado: PASS.
- [ ] **Step 7: Commit** `fix(navigation): follow the app theme in the navigation container`. Corpo: o container usava o tema claro padrão e expunha `rgb(242,242,242)` nas cenas durante o fade entre abas no modo escuro; agora o tema é derivado do esquema ativo e da paleta.

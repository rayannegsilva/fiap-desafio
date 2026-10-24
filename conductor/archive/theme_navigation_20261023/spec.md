# Spec: Tema e navegação (fundação)

**Tipo:** Feature (fundação, sem telas reais)
**Origem:** [`docs/superpowers/plans/2026-10-23-theme-navigation-foundation.md`](../../../docs/superpowers/plans/2026-10-23-theme-navigation-foundation.md) — detalhes de código, comandos e testes de cada task estão lá.

## Visão geral

Tema Restyle tipado (escuro padrão, claro derivado) e esqueleto de navegação (stack raiz + bottom-tabs da área autenticada), com telas placeholder, para que as tracks seguintes só preencham conteúdo. Nenhuma funcionalidade real entra aqui.

## Requisitos funcionais

1. **Tema:** paleta e tema Restyle (`src/theme/palette.ts`, `theme.ts`) com todos os tokens de cor e as 14 variantes de tipografia de `conductor/product-guidelines.md`, escuro padrão, claro derivado. `textVariants.defaults = {}` (exigência do Restyle).
2. **Store de tema:** `useThemeStore` (Zustand + AsyncStorage, persistida), `{ theme: 'dark' | 'light', toggleTheme() }`, padrão escuro, sem UI de troca (fica para a track do cabeçalho).
3. **`useAppTheme()`:** hook que resolve o tema ativo a partir da store.
4. **Box/Text tipados:** `createBox<Theme>()`/`createText<Theme>()` em `src/theme/restyle.ts`.
5. **Rotas tipadas:** `RootStackParamList` (`Login`, `Main`, `TrocaAluno`) e `MainTabParamList` (`Aulas`, `Boletim`) em `src/routes/types.ts`.
6. **Telas placeholder:** `Login`, `Aulas`, `Boletim`, `TrocaAluno`, cada uma só com o nome da tela, usando o tema.
7. **`AppProviders`:** componente de produção que resolve `useAppTheme()` e envolve em `ThemeProvider` + `NavigationContainer`; reaproveitado por `App.tsx` e por `renderWithProviders` (que passa a envolver tema + navegação, além do `SafeAreaProvider` já existente).
8. **`MainTabNavigator`:** bottom-tabs Aulas/Boletim, ícones `calendar`/`check-file` tingidos por `accentText` (ativa)/`textPrimary` (inativa), altura 64, fundo `surface`.
9. **`RootNavigator`:** stack raiz, `initialRouteName="Login"`, sem gating de sessão, três rotas (`Login`, `Main`, `TrocaAluno`), `headerShown: false`.
10. **`App.tsx`:** compõe `SafeAreaProvider` → `AppProviders` → `RootNavigator`.
11. **Acesso temporário de QA:** botão em `Login` ("Entrar (temporário)") → `Main`; botão em `Aulas` ("Trocar aluno (temporário)") → `TrocaAluno`. Removidos quando login e cabeçalho reais entrarem.
12. **README:** status atualizado.

## Requisitos não funcionais

- Nenhum valor de cor/espaçamento/fonte hardcoded em componente — tudo vem de `useAppTheme()`.
- Rotas tipadas, sem strings soltas de rota.
- Um commit por task (Conventional Commits, corpo com 3–5 linhas).
- Cobertura ≥ 80% no código novo.

## Critérios de aceite

1. `useAppTheme()` retorna o tema ativo com todos os tokens de cor e as 14 variantes de tipografia, idênticos à tabela de `product-guidelines.md`.
2. Preferência de tema persiste entre reaberturas do app (Zustand + AsyncStorage), padrão escuro.
3. Navegando: `Login` → botão temporário → `Main` (bottom-tabs) → botão temporário em `Aulas` → `TrocaAluno` (sem header/footer); voltar verificado manualmente.
4. Ícones do rodapé mudam de cor entre aba ativa e inativa.
5. `yarn ios`/`yarn android`: app abre em Login, navega até as 4 telas, layout não quebra em nenhuma.
6. `yarn lint`, `yarn typecheck`, `CI=true yarn test --coverage` passam.
7. README reflete o status da track.

## Fora de escopo

- Cabeçalho, UI de troca de tema, telas reais (login funcional, aulas, boletim, troca de aluno de verdade), dados (JSON embarcado), animações de conteúdo de tela.
- E2E.

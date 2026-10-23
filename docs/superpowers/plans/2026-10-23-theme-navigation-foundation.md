# Tema e navegação (fundação) — Implementation Plan

> **Para agentes executores:** este plano é registrado como track via `conductor-new-track` e executado com `conductor-implement`, seguindo `conductor/workflow.md` (um commit por task com resumo de 3–5 linhas no corpo, SHA no `plan.md` da track). Steps usam checkbox (`- [ ]`).

**Goal:** Tema Restyle tipado (escuro padrão, claro derivado) e esqueleto de navegação (stack raiz + bottom-tabs da área autenticada), com telas placeholder, para que as tracks seguintes só preencham conteúdo.

**Architecture:** Tema em `src/theme/` (paleta crua → objeto Restyle → store Zustand persistida → hook `useAppTheme`). Navegação em `src/routes/` (tipos de rota, stack raiz, bottom-tabs). Telas placeholder em `src/screens/<Nome>/<Nome>.tsx`, uma pasta por tela. `renderWithProviders` passa a envolver tema + navegação, viabilizando teste de integração das próprias telas. `App.tsx` compõe tudo.

**Tech Stack:** @shopify/restyle 2.4.5, @react-navigation/native 7.5 + native-stack 7.21 + bottom-tabs 7.21, zustand 5.0 + @react-native-async-storage/async-storage, React Native Testing Library 14 — todos já instalados (track anterior).

## Contexto

Track anterior deixou a stack 100% instalada e verificada (iOS/Android), sem nenhuma tela ou tema reais. Esta track é só fundação: tema + navegação-esqueleto. Nenhuma funcionalidade real (login, dados, cabeçalho) entra aqui — ver Não-objetivos. O design completo (cores, tipografia, espaçamento, textos) já está documentado em `conductor/product-guidelines.md` e `conductor/product.md`; este plano referencia essas tabelas em vez de duplicá-las.

## Não-objetivos

- Cabeçalho (depende de dados de responsável/aluno que não existem ainda).
- UI de troca de tema (fica no cabeçalho, outra track).
- Telas reais: login funcional, lista de aulas, boletim, seleção de aluno de verdade.
- Dados (JSON embarcado, camada de consulta).
- Animações de conteúdo de tela (splash, entradas); só a transição de navegação padrão da lib.

## Decisões

| Decisão | Escolha | Motivo |
|---|---|---|
| Escala de espaçamento | `[0, 4, 8, 16, 24, 28, 48]` | Cobre os valores citados em `product-guidelines.md` (16, 24–28, 48) + incrementos padrão menores |
| Escala de raio | `{ none: 0, default: 8 }` | Único raio citado no design é 8; alturas de componente (45/60/64/90) ficam no componente, não no tema |
| Rota inicial | `RootNavigator` sempre começa em `Login`, sem gating de sessão | Sessão/autenticação não existem nesta track; "abrir direto em Aulas se logado" fica para a track de login |
| `renderWithProviders` | Estendido para envolver `ThemeProvider` + `NavigationContainer`, além do `SafeAreaProvider` já existente | É o harness padrão citado em `conductor/workflow.md`; esta track introduz tema e navegação |
| Acesso à Troca de aluno nesta track | Botão temporário na tela Aulas (`accessibilityLabel="Trocar aluno (temporário)"`) navega para `TrocaAluno` | Único gatilho possível sem cabeçalho; removido quando o cabeçalho real entrar |
| Acesso de Login a Main nesta track | Botão temporário na tela Login (`accessibilityLabel="Entrar (temporário)"`) navega para `Main` | `Login` não tem lógica real ainda (não-objetivo); sem ele, `Main`/`Aulas`/`Boletim`/`TrocaAluno` ficariam inalcançáveis por navegação de verdade, inviabilizando a verificação manual do checkpoint. Removido quando a track de login entrar |
| Conteúdo dos placeholders | Texto com o nome da tela, usando o tema (não `View` vazia) | Valida visualmente navegação e tema nos dois modos |
| Variante de texto "defaults" | Tema inclui `textVariants.defaults = {}` | Exigência do Restyle: `variant` do `Text` cai em `defaults` quando omitido |

## Critérios de aceite

1. `useAppTheme()` retorna o tema ativo (claro ou escuro) com todos os tokens de cor e as 14 variantes de tipografia de `product-guidelines.md`, idênticos aos valores da tabela.
2. Preferência de tema persiste entre reaberturas do app (Zustand + AsyncStorage), padrão escuro.
3. Navegando: `Login` → botão temporário "Entrar (temporário)" → `Main` (bottom-tabs `Aulas`/`Boletim`) → botão temporário em `Aulas` → `TrocaAluno` (sem header/footer); voltar de `TrocaAluno` verificado manualmente (gesto/botão físico).
4. Ícones do rodapé (`calendar`, `check-file`) mudam de cor entre aba ativa (`accentText`) e inativa (`textPrimary`).
5. `yarn ios`/`yarn android`: app abre em Login, navega até as 4 telas, tema muda via dev tools/teste (sem UI ainda) e o layout não quebra em nenhuma.
6. `yarn lint`, `yarn typecheck`, `CI=true yarn test --coverage` (≥80%) passam.

## Global Constraints

- Nenhum valor de cor/espaçamento/fonte hardcoded em componente — tudo vem de `useAppTheme()`.
- Rotas tipadas (`RootStackParamList`, `MainTabParamList`); nenhuma string solta de nome de rota.
- Named exports em `src/` (exceto configs).
- RNTL 14: `render`, `fireEvent`, `act` são assíncronos — sempre `await`.
- Commits: Conventional Commits, resumo de 3–5 linhas.
- Cores/tipografia copiadas literalmente das tabelas em `conductor/product-guidelines.md` (seções "Cores" e "Tipografia").

## Review Focus

1. **Tema claro não aplicado de verdade** — teste deve trocar `theme` na store e verificar que `useAppTheme()` muda de fato (não só que a store mudou).
2. **Ícone do rodapé com cor fixa** — teste deve verificar a cor via prop `color`/`fill` repassada ao SVG mockado, não só que o ícone renderiza.
3. **Navegação de volta da Troca de aluno não especificada no design** (`product.md`: "após a escolha, volta para a tela anterior") — `TrocaAluno` ainda não tem o `FECHAR`/X real do design (fora de escopo), então voltar via gesto/botão físico é só verificação manual no checkpoint, não teste automatizado.
4. **`textVariants` sem `defaults`** quebra qualquer `Text` do Restyle sem `variant` explícito — teste do tema confirma que a chave existe.
5. **Tab bar sem padding de safe area** no Android (gesture nav) — fora do escopo de teste automatizado; incluir na verificação manual do checkpoint.

---

## Fase 1: Tema

### Task 1: Paleta e tema Restyle

**Files:**
- Create: `src/theme/palette.ts`, `src/theme/theme.ts`, `src/theme/theme.test.ts`

**Interfaces:**
- Produces: `darkPalette`, `lightPalette` (`Record<ColorToken, string>`) em `palette.ts`; `darkTheme`, `lightTheme` (tipo `Theme`, via `createTheme` do `@shopify/restyle`) em `theme.ts`, exportando também `type Theme = typeof darkTheme`.

- [ ] **Step 1: Escrever teste falhando**

```ts
// theme.test.ts
import { darkTheme, lightTheme } from './theme';

it('dark theme uses the figma background and accent tokens', () => {
  expect(darkTheme.colors.background).toBe('#000000');
  expect(darkTheme.colors.accent).toBe('#29F4D5');
  expect(darkTheme.colors.accentText).toBe('#29F4D5');
});

it('light theme derives accentText for AA contrast, keeping accent', () => {
  expect(lightTheme.colors.background).toBe('#FFFFFF');
  expect(lightTheme.colors.accent).toBe('#29F4D5');
  expect(lightTheme.colors.accentText).toBe('#006B5D');
});

it('exposes all 14 typography variants plus the restyle default', () => {
  const variants = Object.keys(darkTheme.textVariants);
  expect(variants).toEqual(
    expect.arrayContaining([
      'defaults', 'inputValue', 'greeting', 'screenTitle', 'sectionTitle',
      'button', 'label', 'emptyState', 'body', 'bodyMedium', 'bodyStrong',
      'error', 'cardTitle', 'caption', 'captionMedium', 'tab',
    ]),
  );
});

it('bodyStrong variant matches the figma spec (16/20 semibold)', () => {
  expect(darkTheme.textVariants.bodyStrong).toMatchObject({
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Montserrat-SemiBold',
  });
});
```

- [ ] **Step 2: Rodar teste, confirmar FAIL** (`theme.ts` não existe)

Run: `CI=true yarn test theme.test.ts`

- [ ] **Step 3: Implementar `palette.ts`**

`darkPalette` e `lightPalette`: todas as 11 chaves da tabela "Cores" de `product-guidelines.md` (`background`, `surface`, `surfaceRaised`, `accent`, `accentText`, `onAccent`, `brand`, `textPrimary`, `textDisabled`, `lineIdle`, `lineActive`, `marker`), valores hex exatos da tabela (colunas "Escuro (Figma)" e "Claro (derivado)").

- [ ] **Step 4: Implementar `theme.ts`**

`darkTheme = createTheme({ colors: darkPalette, spacing: { none: 0, xs: 4, s: 8, m: 16, l: 24, xl: 28, xxl: 48 }, borderRadii: { none: 0, default: 8 }, textVariants: { defaults: {}, ...<14 variantes> } })`. Cada variante usa `fontSize`/`lineHeight` da coluna "Tamanho/linha" (ex. `20/24` → `fontSize: 20, lineHeight: 24`), `fontFamily: 'Montserrat-<Peso>'` (peso da coluna "Peso"; "Regular (nome em Bold)" em `greeting` vira duas variantes: manter `greeting` com peso Regular — o Bold do nome é estilo inline de quem usa, fora do tema) e `color` resolvido pela coluna "Cor" (token do tema, ex. `accentText`). `lightTheme = createTheme({ ...darkTheme, colors: lightPalette })`.

- [ ] **Step 5: Rodar teste, confirmar PASS**

Run: `CI=true yarn test theme.test.ts`

- [ ] **Step 6: Commit**

```bash
git add src/theme/palette.ts src/theme/theme.ts src/theme/theme.test.ts
git commit -m "feat(theme): add restyle dark and light themes" -m "- Paleta e tema Restyle com os tokens de cor e tipografia do design
- 14 variantes de texto + variante defaults exigida pelo Restyle
- Testes cobrindo tokens-chave de cada tema"
```

### Task 2: Store de tema persistida + hook `useAppTheme`

**Files:**
- Create: `src/store/useThemeStore.ts`, `src/store/useThemeStore.test.ts`, `src/theme/useAppTheme.ts`, `src/theme/useAppTheme.test.tsx`

**Interfaces:**
- Consumes: `darkTheme`, `lightTheme`, `type Theme` de `../theme/theme` (Task 1).
- Produces: `useThemeStore` (store Zustand: `{ theme: 'dark' | 'light', toggleTheme(): void }`, persistida com `name: 'theme-storage'`); `useAppTheme(): Theme` em `useAppTheme.ts`.

- [ ] **Step 1: Escrever teste falhando da store**

```ts
// useThemeStore.test.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeStore } from './useThemeStore';

it('defaults to dark theme', () => {
  expect(useThemeStore.getState().theme).toBe('dark');
});

it('toggles and persists the theme', async () => {
  await act(() => useThemeStore.getState().toggleTheme());
  expect(useThemeStore.getState().theme).toBe('light');
  const stored = await AsyncStorage.getItem('theme-storage');
  expect(JSON.parse(stored!).state.theme).toBe('light');
});
```

(`act` de `@testing-library/react-native`.)

- [ ] **Step 2: Rodar teste, confirmar FAIL**

Run: `CI=true yarn test useThemeStore.test.ts`

- [ ] **Step 3: Implementar `useThemeStore.ts`**

`create<{ theme: 'dark' | 'light'; toggleTheme: () => void }>()(persist(set => ({ theme: 'dark', toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })) }), { name: 'theme-storage', storage: createJSONStorage(() => AsyncStorage) }))` — mesmo padrão do smoke test em `src/test/libraries.test.tsx`.

- [ ] **Step 4: Rodar teste, confirmar PASS**

- [ ] **Step 5: Escrever teste falhando do hook**

```tsx
// useAppTheme.test.tsx
import { renderHook } from '@testing-library/react-native';
import { useThemeStore } from '../store/useThemeStore';
import { useAppTheme } from './useAppTheme';
import { darkTheme, lightTheme } from './theme';

it('returns the dark theme object by default', async () => {
  const { result } = await renderHook(() => useAppTheme());
  expect(result.current).toBe(darkTheme);
});

it('returns the light theme object after toggling', async () => {
  await act(() => useThemeStore.getState().toggleTheme());
  const { result } = await renderHook(() => useAppTheme());
  expect(result.current).toBe(lightTheme);
});
```

- [ ] **Step 6: Rodar teste, confirmar FAIL**

- [ ] **Step 7: Implementar `useAppTheme.ts`**

`useAppTheme = (): Theme => useThemeStore(s => s.theme) === 'dark' ? darkTheme : lightTheme`.

- [ ] **Step 8: Rodar os dois testes, confirmar PASS**

- [ ] **Step 9: Commit**

```bash
git add src/store/useThemeStore.ts src/store/useThemeStore.test.ts src/theme/useAppTheme.ts src/theme/useAppTheme.test.tsx
git commit -m "feat(theme): add persisted theme store and useAppTheme hook" -m "- Store Zustand com toggleTheme, persistida em AsyncStorage, padrão escuro
- useAppTheme() resolve o objeto de tema ativo (dark/lightTheme)
- Sem UI de troca ainda; fica para a track do cabeçalho"
```

- [ ] **Task: Phase Verification & Checkpoint (Refer to workflow.md)**

---

## Fase 2: Navegação

### Task 3: `Box`/`Text` tipados, tipos de rota e telas placeholder

**Files:**
- Create: `src/theme/restyle.ts`, `src/routes/types.ts`, `src/screens/Login/Login.tsx`, `src/screens/Login/Login.test.tsx`, `src/screens/Aulas/Aulas.tsx`, `src/screens/Aulas/Aulas.test.tsx`, `src/screens/Boletim/Boletim.tsx`, `src/screens/Boletim/Boletim.test.tsx`, `src/screens/TrocaAluno/TrocaAluno.tsx`, `src/screens/TrocaAluno/TrocaAluno.test.tsx`

**Interfaces:**
- Consumes: `renderWithProviders` de `../../test/renderWithProviders` (assinatura atual; Task 4 estende o que ela envolve, não a assinatura); `useAppTheme`, `type Theme` (Task 2).
- Produces: `Box`, `Text` (componentes Restyle tipados com `Theme`) em `restyle.ts`; `type RootStackParamList = { Login: undefined; Main: undefined; TrocaAluno: undefined }`; `type MainTabParamList = { Aulas: undefined; Boletim: undefined }` em `routes/types.ts`. Componentes `Login`, `Aulas`, `Boletim`, `TrocaAluno` (named exports, sem props ainda — botões de navegação entram na Task 6).

- [ ] **Step 1: Escrever testes falhando (um por tela)**

Cada teste no padrão (exemplo `Login.test.tsx`):

```tsx
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Login } from './Login';

it('renders the screen title', async () => {
  await renderWithProviders(<Login />);
  expect(screen.getByText('Login')).toBeOnTheScreen();
});
```

Repetir para `Aulas` (texto `'Aulas'`), `Boletim` (texto `'Boletim'`), `TrocaAluno` (texto `'Troca de aluno'`).

- [ ] **Step 2: Rodar os 4 testes, confirmar FAIL**

- [ ] **Step 3: Implementar `src/theme/restyle.ts`**

`export const Box = createBox<Theme>();` e `export const Text = createText<Theme>();` (de `@shopify/restyle`, tipo `Theme` da Task 1).

- [ ] **Step 4: Implementar `routes/types.ts`** com os dois tipos acima.

- [ ] **Step 5: Implementar as 4 telas**

Cada uma: `export function <Nome>() { return <Box flex={1} backgroundColor="background" justifyContent="center" alignItems="center"><Text variant="screenTitle">{<texto>}</Text></Box>; }`, usando `Box`/`Text` de `../../theme/restyle` (a cor/fonte já vêm do `ThemeProvider` ativo via `renderWithProviders`/`App`, sem chamar `useAppTheme` diretamente na tela).

- [ ] **Step 6: Rodar os 4 testes, confirmar PASS**

- [ ] **Step 7: Commit**

```bash
git add src/theme/restyle.ts src/routes/types.ts src/screens
git commit -m "feat(routes): add typed route params and placeholder screens" -m "- Box/Text tipados com o tema (createBox/createText do Restyle)
- RootStackParamList e MainTabParamList tipados
- 4 telas placeholder (Login, Aulas, Boletim, TrocaAluno)"
```

### Task 4: `renderWithProviders` estendido e bottom-tabs

**Files:**
- Create: `src/theme/AppProviders.tsx`, `src/routes/MainTabNavigator.tsx`, `src/routes/MainTabNavigator.test.tsx`
- Modify: `src/test/renderWithProviders.tsx`

**Interfaces:**
- Consumes: `useAppTheme` (Task 2), `RootStackParamList`/`MainTabParamList` (Task 3), ícones `src/assets/icons/calendar.svg`, `src/assets/icons/check-file.svg`.
- Produces: `AppProviders({ children }: { children: ReactNode }): JSX.Element` em `src/theme/AppProviders.tsx` (resolve `useAppTheme()` e envolve em `ThemeProvider` + `NavigationContainer` — componente de produção, não só de teste, usado por `App.tsx` na Task 5); `renderWithProviders(ui: ReactElement): Promise<RenderResult>` (assinatura inalterada); `MainTabNavigator(): JSX.Element`.

- [ ] **Step 1: Escrever teste falhando do tab navigator**

```tsx
// MainTabNavigator.test.tsx
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../test/renderWithProviders';
import { darkTheme } from '../theme/theme';
import { MainTabNavigator } from './MainTabNavigator';

it('tints the active tab icon with accentText and the inactive one with textPrimary', async () => {
  await renderWithProviders(<MainTabNavigator />);
  expect(screen.getByTestId('tab-icon-aulas').props.color).toBe(darkTheme.colors.accentText);
  expect(screen.getByTestId('tab-icon-boletim').props.color).toBe(darkTheme.colors.textPrimary);
});

it('switches to Boletim when its tab is pressed', async () => {
  await renderWithProviders(<MainTabNavigator />);
  await fireEvent.press(screen.getByLabelText('Boletim'));
  expect(await screen.findByText('Boletim')).toBeOnTheScreen();
});
```

- [ ] **Step 2: Rodar teste, confirmar FAIL**

- [ ] **Step 3: Implementar `AppProviders.tsx` e atualizar `renderWithProviders.tsx`**

`AppProviders`: componente que chama `useAppTheme()` e envolve `children` em `ThemeProvider theme={...}` → `NavigationContainer`. `renderWithProviders` passa a envolver `ui` em `SafeAreaProvider` → `AppProviders`.

- [ ] **Step 4: Implementar `MainTabNavigator.tsx`**

`createBottomTabNavigator<MainTabParamList>()`; duas `Tab.Screen` (`Aulas`, `Boletim`), `tabBarIcon: ({ color }) => <Calendar testID="tab-icon-aulas" width={24} height={24} color={color} />` (idem `CheckFile testID="tab-icon-boletim"` para Boletim), `tabBarActiveTintColor: theme.colors.accentText`, `tabBarInactiveTintColor: theme.colors.textPrimary`, `tabBarStyle: { backgroundColor: theme.colors.surface, height: 64 }`, `tabBarLabelStyle` a partir da variante `tab` do tema, `headerShown: false`. `theme` vem de `useAppTheme()` dentro do componente.

- [ ] **Step 5: Rodar teste, confirmar PASS**

- [ ] **Step 6: Commit**

```bash
git add src/theme/AppProviders.tsx src/routes/MainTabNavigator.tsx src/routes/MainTabNavigator.test.tsx src/test/renderWithProviders.tsx
git commit -m "feat(routes): add bottom tab navigator and extend test providers" -m "- AppProviders: ThemeProvider + NavigationContainer, reaproveitado por App e testes
- MainTabNavigator com abas Aulas/Boletim, ícones tingidos pelo tema
- renderWithProviders usa AppProviders; testes de troca de aba"
```

### Task 5: Stack raiz e `App.tsx`

**Files:**
- Create: `src/routes/RootNavigator.tsx`, `src/routes/RootNavigator.test.tsx`
- Modify: `src/App.tsx`, `src/App.test.tsx`

**Interfaces:**
- Consumes: `MainTabNavigator`, `AppProviders` (Task 4), telas `Login`/`TrocaAluno` (Task 3).
- Produces: `RootNavigator(): JSX.Element`; `App(): JSX.Element` atualizado.

- [ ] **Step 1: Escrever teste falhando**

```tsx
// RootNavigator.test.tsx
it('starts on the Login screen', async () => {
  await renderWithProviders(<RootNavigator />);
  expect(screen.getByText('Login')).toBeOnTheScreen();
});
```

```tsx
// App.test.tsx (substitui o teste atual, que buscava 'FiapTeste')
it('renders the app starting on Login', async () => {
  await render(<App />);
  expect(screen.getByText('Login')).toBeOnTheScreen();
});
```

- [ ] **Step 2: Rodar os dois, confirmar FAIL**

- [ ] **Step 3: Implementar `RootNavigator.tsx`**

`createNativeStackNavigator<RootStackParamList>()`, `initialRouteName="Login"`, três `Stack.Screen` (`Login`, `Main` → `MainTabNavigator`, `TrocaAluno`), `screenOptions={{ headerShown: false }}`.

- [ ] **Step 4: Atualizar `App.tsx`**

Substituir o `<Text>FiapTeste</Text>` atual por `<SafeAreaProvider><AppProviders><RootNavigator /></AppProviders></SafeAreaProvider>` (`AppProviders` da Task 4 já inclui `NavigationContainer`).

- [ ] **Step 5: Rodar os dois testes, confirmar PASS**

- [ ] **Step 6: Commit**

```bash
git add src/routes/RootNavigator.tsx src/routes/RootNavigator.test.tsx src/App.tsx src/App.test.tsx
git commit -m "feat(routes): add root stack navigator and wire it into App" -m "- RootNavigator: Login, Main (tabs) e TrocaAluno empilhados
- App.tsx compõe tema, safe area e navegação
- App inicia sempre em Login, sem gating de sessão (track de login decide)"
```

### Task 6: Acesso temporário entre telas (Login→Main, Aulas→TrocaAluno)

Sem estas duas, `Main`/`Aulas`/`Boletim`/`TrocaAluno` ficam inalcançáveis por navegação real nesta track (Login não tem lógica, cabeçalho não existe) — ver Decisões.

**Files:**
- Modify: `src/screens/Login/Login.tsx`, `src/screens/Login/Login.test.tsx`, `src/screens/Aulas/Aulas.tsx`, `src/screens/Aulas/Aulas.test.tsx`
- Test: `src/routes/RootNavigator.test.tsx` (adicionar caso de ponta a ponta)

**Interfaces:**
- Consumes: `useNavigation<NativeStackNavigationProp<RootStackParamList>>()` (`@react-navigation/native`) em `Login` e `Aulas`.

- [ ] **Step 1: Escrever teste falhando (ponta a ponta) em `RootNavigator.test.tsx`**

```tsx
it('walks Login -> Main (Aulas) -> TrocaAluno and back via the temporary buttons', async () => {
  await renderWithProviders(<RootNavigator />);
  await fireEvent.press(screen.getByLabelText('Entrar (temporário)'));
  expect(await screen.findByText('Aulas')).toBeOnTheScreen();

  await fireEvent.press(screen.getByLabelText('Trocar aluno (temporário)'));
  expect(await screen.findByText('Troca de aluno')).toBeOnTheScreen();
});
```

Voltar de `TrocaAluno` (gesto/botão físico do SO) não é simulável no RNTL sem UI própria de voltar (fora de escopo: `TrocaAluno` ainda não tem o `FECHAR`/X real do design) — cobrir na verificação manual do checkpoint, não neste teste.

- [ ] **Step 2: Rodar teste, confirmar FAIL**

- [ ] **Step 3: Implementar o botão em `Login.tsx`**

`accessibilityRole="button"`, `accessibilityLabel="Entrar (temporário)"`, `onPress={() => navigation.navigate('Main')}`, texto curto (ex. "Entrar").

- [ ] **Step 4: Implementar o botão em `Aulas.tsx`**

`accessibilityRole="button"`, `accessibilityLabel="Trocar aluno (temporário)"`, `onPress={() => navigation.navigate('TrocaAluno')}`, texto curto (ex. "Trocar aluno").

- [ ] **Step 5: Rodar o teste de ponta a ponta e os testes unitários de `Login`/`Aulas` atualizados, confirmar PASS**

- [ ] **Step 6: Commit**

```bash
git add src/screens/Login/Login.tsx src/screens/Login/Login.test.tsx src/screens/Aulas/Aulas.tsx src/screens/Aulas/Aulas.test.tsx src/routes/RootNavigator.test.tsx
git commit -m "feat(routes): add temporary navigation buttons for manual QA" -m "- Login -> Main e Aulas -> TrocaAluno, únicos gatilhos sem login/cabeçalho reais
- Removidos quando as tracks de login e cabeçalho entrarem
- Teste de ponta a ponta cobre o caminho completo de navegação"
```

- [ ] **Task: Phase Verification & Checkpoint (Refer to workflow.md)**

---

## Fase 3: Documentação

### Task 7: README

- [ ] **Step 1:** Atualizar **Status** (linha "Tema e navegação (fundação)" ✅) e, se a estrutura (`src/theme`, `src/store`, `src/routes`, `src/screens`) mudou o suficiente, a árvore em **Estrutura**.
- [ ] **Step 2:** `yarn lint && yarn typecheck && CI=true yarn test --coverage` → PASS.
- [ ] **Step 3: Commit** `docs: update readme with theme and navigation foundation`.

- [ ] **Task: Phase Verification & Checkpoint (Refer to workflow.md) — track concluída.**

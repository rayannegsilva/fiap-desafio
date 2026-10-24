# Componentes base — Implementation Plan

> **Para agentes executores:** este plano é registrado como track via `conductor-new-track` e executado com `conductor-implement`, seguindo `conductor/workflow.md` (um commit por task com resumo de 3–5 linhas no corpo, SHA no `plan.md` da track). Steps usam checkbox (`- [ ]`).

**Goal:** Camada `src/components/` com os componentes que as telas vão usar — `Text`, `PrimaryButton`, `TextButton`, `TextField`, `Collapsible`, `Dropdown` — mais `usePressScale` (microinteração de toque) e `formatCpf` (máscara).

**Architecture:** Um componente por comportamento, não por tela: `Dropdown` (escolhe uma opção, painel flutua por cima) serve Aulas e Boletim; `Collapsible` (abre/fecha, empurra o conteúdo) serve os dois níveis do boletim. Componentes não conhecem dados do domínio (dia, ano, CPF): recebem valores e callbacks. Estilo só por tokens do tema; constantes de animação em `src/theme/motion.ts`.

**Tech Stack:** @shopify/restyle 2.4.5, react-native-reanimated 4 (`useReducedMotion`, `withSpring`, `withTiming`, `withSequence`, `FadeIn`/`FadeOut`, `LinearTransition`), react-native-svg (ícones com `color`), RNTL 14 — tudo já instalado.

**Spec:** design em `conductor/product-guidelines.md` (Cores, Tipografia, Layout, Componentes e estados, Acessibilidade, Animações, Microinterações). Decisões abaixo vêm da conversa de planejamento.

## Decisões

| Decisão | Escolha | Motivo |
|---|---|---|
| Variantes de texto | Continuam em `theme.textVariants` | Convenção do Restyle (tipagem do prop `variant`) |
| `Text` | Componente fino em `components/` sobre o `Text` do Restyle: `variant` padrão `body`, `maxFontSizeMultiplier` padrão `1.3` | Agrega padrão + fonte dinâmica sem quebrar layout; aceita todos os props nativos |
| Botões | Dois componentes: `PrimaryButton` (FAZER LOGIN) e `TextButton` (TROCAR PERFIL, SAIR, FECHAR) | Visuais e estados diferentes |
| Toque | Hook `usePressScale` compartilhado | Mesma ação → mesma animação |
| Máscara de CPF | Fora do campo: `formatCpf` em `utils/` | `TextField` genérico, não sabe de CPF |
| `Collapsible` | Um só, `variant: 'card' \| 'row'` (trimestre / disciplina), conteúdo empurra o que vem abaixo | Mesmo comportamento, visual diferente |
| `Dropdown` | Um só, genérico (`options`, `selected`, `onSelect`, `getLabel`, `getKey`); painel **flutua** por cima do conteúdo | Design (Figma): a lista cobre o card abaixo sem deslocá-lo |
| Abre/fecha | Render condicional com layout animations do Reanimated (`FadeIn`/`FadeOut` + `LinearTransition`), chevron gira 180° | Simples, testável, respeita "reduzir movimento" |
| Constantes de movimento | `src/theme/motion.ts` | `code_styleguides`: durações e springs centralizados |

## Critérios de aceite

1. Telas e componentes importam `Text` de `src/components/Text`, não de `theme/restyle`.
2. Cada componente tem teste ao lado cobrindo comportamento e acessibilidade (role, label, estado).
3. "Reduzir movimento" ligado: sem escala no toque, sem shake no erro (só opacidade/nada).
4. Nenhum valor de cor/espaçamento/fonte fixo nos componentes — só tokens do tema e `motion`.
5. `yarn lint`, `yarn typecheck`, `CI=true yarn test --coverage` (≥ 80%) passam.

## Global Constraints

- Named exports; um componente por arquivo, `src/components/<Nome>/<Nome>.tsx` + `<Nome>.test.tsx`.
- Props tipadas com `type Props = {...}`.
- Reanimated para animações (nunca `Animated` do core); respeitar `useReducedMotion()`.
- Áreas de toque ≥ 44×44 (`hitSlop` quando o visual for menor).
- RNTL 14: `render`, `fireEvent`, `act` assíncronos — sempre `await`. Consultar por role/texto/label; `testID` só quando não houver alternativa.
- Testes usam `renderWithProviders` (tema + navegação + safe area).
- Commits: Conventional Commits, subject minúsculo, corpo 3–5 linhas, **sem linha `Co-Authored-By` ou qualquer atribuição**.

## Review Focus

1. **CPF colado já formatado ou com lixo** (`"123.456.789-01"`, `"abc123"`, 14 dígitos) → `formatCpf` normaliza para a máscara e corta em 11 dígitos. Teste na Task 3.
2. **Toque duplo em botão carregando/desabilitado** → `onPress` não dispara. Teste na Task 4.
3. **"Reduzir movimento" ligado** → `usePressScale` não escala; `TextField` não sacode. Testes nas Tasks 2 e 6.
4. **Fonte do sistema no máximo** → `Text` limita a escala (`maxFontSizeMultiplier`), sobrescrevível. Teste na Task 1.
5. **Título longo no `Collapsible`/`Dropdown`** ("PRODUÇÃO E INTERPRETAÇÃO DE TEXTOS") → texto quebra e o chevron continua visível à direita (texto com `flex: 1`). Verificação manual no checkpoint da Fase 3.

---

## Fase 1: Fundamentos

### Task 1: `Text`

**Files:**
- Create: `src/components/Text/Text.tsx`, `src/components/Text/Text.test.tsx`
- Modify: `src/screens/{Login,Aulas,Boletim,TrocaAluno}/*.tsx` (importar `Text` de `../../components/Text/Text`; `Box` continua de `theme/restyle`)

**Interfaces:**
- Produces: `Text(props: ComponentProps<typeof RestyleText>): JSX.Element` — mesmos props do `Text` do Restyle (inclui nativos), com `variant = 'body'` e `maxFontSizeMultiplier = 1.3` como padrão.

- [ ] **Step 1: Teste falhando**

```tsx
it('defaults to the body variant', async () => {
  await renderWithProviders(<Text>olá</Text>);
  expect(screen.getByText('olá')).toHaveStyle({ fontFamily: 'Montserrat-Regular', fontSize: 16 });
});

it('limits dynamic font scaling by default and allows override', async () => {
  await renderWithProviders(<><Text>a</Text><Text maxFontSizeMultiplier={2}>b</Text></>);
  expect(screen.getByText('a').props.maxFontSizeMultiplier).toBe(1.3);
  expect(screen.getByText('b').props.maxFontSizeMultiplier).toBe(2);
});

it('forwards native props', async () => {
  await renderWithProviders(<Text numberOfLines={1} accessibilityRole="header">t</Text>);
  expect(screen.getByRole('header')).toHaveProp('numberOfLines', 1);
});
```

- [ ] **Step 2:** `CI=true yarn test Text.test` → FAIL (módulo não existe).
- [ ] **Step 3:** Implementar `Text` repassando props ao `Text` de `theme/restyle` com os dois padrões. Trocar o import de `Text` nas 4 telas.
- [ ] **Step 4:** `CI=true yarn test` → PASS (inclui testes das telas).
- [ ] **Step 5: Commit** `feat(components): add text component with dynamic font limit`

### Task 2: `motion` + `usePressScale`

**Files:**
- Create: `src/theme/motion.ts`, `src/animations/usePressScale.ts`, `src/animations/usePressScale.test.tsx`

**Interfaces:**
- Produces: `motion = { pressScale: 0.96, pressedOpacity: 0.7, spring: { damping: 15, stiffness: 300 }, duration: { micro: 150, transition: 300 } }` (`as const`) em `motion.ts`.
- Produces: `usePressScale(): { animatedStyle: AnimatedStyle<ViewStyle>; onPressIn(): void; onPressOut(): void }`. Normal: `scale` → `motion.pressScale` com `withSpring(motion.spring)` e volta a 1. Com `useReducedMotion()` true: sem escala; `opacity` → `motion.pressedOpacity` com `withTiming(motion.duration.micro)` e volta a 1.

- [ ] **Step 1: Teste falhando** — componente de teste local (`Animated.View` com `animatedStyle` + `Pressable` com `onPressIn`/`onPressOut`, `testID="probe"`), `jest.useFakeTimers()`:

```tsx
it('scales down while pressed and back on release', async () => {
  await render(<Probe />);
  await fireEvent(screen.getByRole('button'), 'pressIn');
  jest.advanceTimersByTime(500);
  expect(screen.getByTestId('probe')).toHaveAnimatedStyle({ transform: [{ scale: 0.96 }] });
  await fireEvent(screen.getByRole('button'), 'pressOut');
  jest.advanceTimersByTime(500);
  expect(screen.getByTestId('probe')).toHaveAnimatedStyle({ transform: [{ scale: 1 }] });
});

it('uses opacity instead of scale when reduce motion is on', async () => {
  jest.mocked(useReducedMotion).mockReturnValue(true);
  await render(<Probe />);
  await fireEvent(screen.getByRole('button'), 'pressIn');
  jest.advanceTimersByTime(500);
  expect(screen.getByTestId('probe')).toHaveAnimatedStyle({ opacity: 0.7, transform: [{ scale: 1 }] });
});
```

(`toHaveAnimatedStyle` vem do `setUpTests()` do Reanimated já chamado no `jest.setup.ts`. `useReducedMotion` é mockado no arquivo de teste com mock parcial — `jest.mock('react-native-reanimated', () => ({ ...jest.requireActual('react-native-reanimated'), useReducedMotion: jest.fn(() => false) }))` — e `afterEach(() => jest.mocked(useReducedMotion).mockReturnValue(false))`. Mesmo padrão na Task 6.)

- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Implementar `motion.ts` e `usePressScale` conforme Interfaces.
- [ ] **Step 4:** Rodar → PASS.
- [ ] **Step 5: Commit** `feat(animations): add press scale hook and motion tokens`

### Task 3: `formatCpf`

**Files:**
- Create: `src/utils/formatCpf.ts`, `src/utils/formatCpf.test.ts`

**Interfaces:**
- Produces: `formatCpf(input: string): string` — mantém só dígitos, corta em 11, aplica `000.000.000-00` progressivamente.

- [ ] **Step 1: Teste falhando**

```ts
it.each([
  ['', ''],
  ['123', '123'],
  ['1234', '123.4'],
  ['1234567', '123.456.7'],
  ['1234567890', '123.456.789-0'],
  ['12345678901', '123.456.789-01'],
  ['123.456.789-01', '123.456.789-01'],
  ['12345678901234', '123.456.789-01'],
  ['abc123def456', '123.456'],
])('formatCpf(%p) -> %p', (input, expected) => {
  expect(formatCpf(input)).toBe(expected);
});
```

- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** Rodar → PASS.
- [ ] **Step 5: Commit** `feat(utils): add cpf mask formatter`

- [ ] **Task: Phase Verification & Checkpoint (Refer to workflow.md)**

---

## Fase 2: Botões e campo

### Task 4: `PrimaryButton`

**Files:**
- Create: `src/components/PrimaryButton/PrimaryButton.tsx`, `PrimaryButton.test.tsx`

**Interfaces:**
- Consumes: `Text` (Task 1), `usePressScale` (Task 2).
- Produces: `PrimaryButton(props: { label: string; onPress: () => void; disabled?: boolean; loading?: boolean }): JSX.Element`.

Visual: largura total, altura 60, fundo `accent`, sem raio, conteúdo centralizado. Label `variant="button"` (`onAccent`); desabilitado: fundo `accent`, label `textDisabled`. Carregando: sem label, `ActivityIndicator` com cor `onAccent`. `accessibilityRole="button"`, `accessibilityLabel={label}` sempre, `accessibilityState={{ disabled, busy: loading }}`. `onPress` ignorado se `disabled || loading`; escala só quando habilitado.

- [ ] **Step 1: Teste falhando**

```tsx
it('calls onPress when enabled', async () => {
  const onPress = jest.fn();
  await renderWithProviders(<PrimaryButton label="FAZER LOGIN" onPress={onPress} />);
  await fireEvent.press(screen.getByRole('button', { name: 'FAZER LOGIN' }));
  expect(onPress).toHaveBeenCalledTimes(1);
});

it('is disabled with dimmed label and ignores presses', async () => {
  const onPress = jest.fn();
  await renderWithProviders(<PrimaryButton label="FAZER LOGIN" onPress={onPress} disabled />);
  const button = screen.getByRole('button', { name: 'FAZER LOGIN' });
  expect(button).toBeDisabled();
  expect(screen.getByText('FAZER LOGIN')).toHaveStyle({ color: darkTheme.colors.textDisabled });
  await fireEvent.press(button);
  expect(onPress).not.toHaveBeenCalled();
});

it('shows a spinner instead of the label while loading and ignores presses', async () => {
  const onPress = jest.fn();
  await renderWithProviders(<PrimaryButton label="FAZER LOGIN" onPress={onPress} loading />);
  const button = screen.getByRole('button', { name: 'FAZER LOGIN' });
  expect(button).toHaveAccessibilityState({ busy: true });
  expect(screen.queryByText('FAZER LOGIN')).toBeNull();
  await fireEvent.press(button);
  expect(onPress).not.toHaveBeenCalled();
});
```

- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Implementar (`Pressable` + `Animated.View` com `usePressScale`).
- [ ] **Step 4:** Rodar → PASS.
- [ ] **Step 5: Commit** `feat(components): add primary button with disabled and loading states`

### Task 5: `TextButton`

**Files:**
- Create: `src/components/TextButton/TextButton.tsx`, `TextButton.test.tsx`

**Interfaces:**
- Consumes: `Text`, `usePressScale`.
- Produces: `TextButton(props: { label: string; onPress: () => void; variant?: 'caption' | 'cardTitle'; icon?: FC<SvgProps>; iconSize?: number }): JSX.Element`.

Visual: linha horizontal, ícone **antes** do label (gap `xs`), sem fundo. `variant` padrão `caption` (TROCAR PERFIL, SAIR); `cardTitle` para FECHAR. Ícone pintado com a mesma cor do texto: `theme.colors[theme.textVariants[variant].color]`, tamanho `iconSize` (padrão 24). `hitSlop` de 12 em cada lado. `accessibilityRole="button"`, `accessibilityLabel={label}`.

- [ ] **Step 1: Teste falhando**

```tsx
it('calls onPress and exposes an accessible button', async () => {
  const onPress = jest.fn();
  await renderWithProviders(<TextButton label="SAIR" onPress={onPress} />);
  await fireEvent.press(screen.getByRole('button', { name: 'SAIR' }));
  expect(onPress).toHaveBeenCalledTimes(1);
});

it('extends the touch area to at least 44pt', async () => {
  await renderWithProviders(<TextButton label="SAIR" onPress={jest.fn()} />);
  expect(screen.getByRole('button', { name: 'SAIR' })).toHaveProp('hitSlop', { top: 12, bottom: 12, left: 12, right: 12 });
});

it('tints the icon with the variant text color', async () => {
  await renderWithProviders(<TextButton label="FECHAR" variant="cardTitle" icon={Close} onPress={jest.fn()} />);
  expect(screen.getByTestId('text-button-icon').props.color).toBe(darkTheme.colors.accentText);
});
```

(`Close` = `import Close from '../../assets/icons/close.svg'`; o componente passa `testID="text-button-icon"` ao ícone.)

- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** Rodar → PASS.
- [ ] **Step 5: Commit** `feat(components): add text button with optional icon`

### Task 6: `TextField`

**Files:**
- Create: `src/components/TextField/TextField.tsx`, `TextField.test.tsx`
- Modify: `src/test/renderWithProviders.tsx` — passar os providers via opção `wrapper` do `render` (`render(ui, { wrapper: Providers })`) em vez de embrulhar o `ui`, para que o `rerender` retornado mantenha tema/navegação/safe area. Assinatura inalterada.

**Interfaces:**
- Consumes: `Text`, `motion`.
- Produces: `TextField(props: TextInputProps & { label: string; error?: string }): JSX.Element`.

Visual: rótulo `variant="label"` acima; `TextInput` com estilo de `theme.textVariants.inputValue` (fonte, tamanho, linha, cor `textPrimary`), centralizado; sublinhado de 1pt (`testID="text-field-underline"`) `lineIdle` se `value` vazio, `lineActive` se preenchido; erro abaixo em `variant="error"` com `accessibilityLiveRegion="polite"`. Quando `error` passa a existir: shake horizontal (`withSequence` -8, 8, -6, 6, 0, cada passo `motion.duration.micro / 3`); com "reduzir movimento" não sacode. `accessibilityLabel={label}` no input; demais props repassadas ao `TextInput`.

- [ ] **Step 1: Teste falhando**

```tsx
it('labels the input and forwards native props', async () => {
  const onChangeText = jest.fn();
  await renderWithProviders(<TextField label="SENHA" value="" onChangeText={onChangeText} secureTextEntry />);
  const input = screen.getByLabelText('SENHA');
  expect(input).toHaveProp('secureTextEntry', true);
  await fireEvent.changeText(input, '123');
  expect(onChangeText).toHaveBeenCalledWith('123');
});

it('switches the underline color when filled', async () => {
  const { rerender } = await renderWithProviders(<TextField label="CPF" value="" />);
  expect(screen.getByTestId('text-field-underline')).toHaveStyle({ backgroundColor: darkTheme.colors.lineIdle });
  await rerender(<TextField label="CPF" value="123" />);
  expect(screen.getByTestId('text-field-underline')).toHaveStyle({ backgroundColor: darkTheme.colors.lineActive });
});

it('shows the error message', async () => {
  await renderWithProviders(<TextField label="CPF" value="1" error="Usuário ou senha inválida. Pode tentar novamente?" />);
  expect(screen.getByText('Usuário ou senha inválida. Pode tentar novamente?')).toHaveStyle({ color: darkTheme.colors.accentText });
});

it('does not shake when reduce motion is on', async () => {
  jest.mocked(useReducedMotion).mockReturnValue(true);
  jest.useFakeTimers();
  const { rerender } = await renderWithProviders(<TextField label="CPF" value="1" testID="field" />);
  await rerender(<TextField label="CPF" value="1" error="erro" testID="field" />);
  jest.advanceTimersByTime(40);
  expect(screen.getByTestId('text-field-container')).toHaveAnimatedStyle({ transform: [{ translateX: 0 }] });
});
```

(Com o `wrapper`, `rerender` mantém os providers; o container animado recebe `testID="text-field-container"`.)

- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** Rodar → PASS.
- [ ] **Step 5: Commit** `feat(components): add text field with underline and error state`

- [ ] **Task: Phase Verification & Checkpoint (Refer to workflow.md)** — sem tela nova nesta fase; verificação manual dos botões e do campo acontece no uso real, na track de Login.

---

## Fase 3: Abre/fecha

### Task 7: `Collapsible`

**Files:**
- Create: `src/components/Collapsible/Collapsible.tsx`, `Collapsible.test.tsx`

**Interfaces:**
- Consumes: `Text`, `motion`, ícone `src/assets/icons/chevron-down.svg`.
- Produces: `Collapsible(props: { title: string; variant: 'card' | 'row'; children: ReactNode; defaultExpanded?: boolean }): JSX.Element`.

Visual: cabeçalho `Pressable` em linha — título (`flex: 1`) + chevron 14 `accentText` à direita, girando 0→180° (`withTiming(motion.duration.micro)`; instantâneo com "reduzir movimento").
- `card`: fundo `surfaceRaised`, raio `default`, altura 90, padding horizontal `m`, título `cardTitle`.
- `row`: sem fundo, padding vertical `s`, título `captionMedium`.

Conteúdo: renderizado só quando aberto, em `Animated.View` com `entering={FadeIn.duration(motion.duration.transition)}`, `exiting={FadeOut...}`, `layout={LinearTransition}`; empurra o que vem abaixo. Acessibilidade: cabeçalho `accessibilityRole="button"`, `accessibilityLabel={title}`, `accessibilityState={{ expanded }}`.

- [ ] **Step 1: Teste falhando**

```tsx
it('starts collapsed and toggles its content', async () => {
  await renderWithProviders(<Collapsible title="1º TRIMESTRE" variant="card"><Text>MATEMÁTICA I</Text></Collapsible>);
  const header = screen.getByRole('button', { name: '1º TRIMESTRE' });
  expect(header).toHaveAccessibilityState({ expanded: false });
  expect(screen.queryByText('MATEMÁTICA I')).toBeNull();
  await fireEvent.press(header);
  expect(header).toHaveAccessibilityState({ expanded: true });
  expect(screen.getByText('MATEMÁTICA I')).toBeOnTheScreen();
  await fireEvent.press(header);
  expect(screen.queryByText('MATEMÁTICA I')).toBeNull();
});

it('can start expanded', async () => {
  await renderWithProviders(<Collapsible title="CIÊNCIAS" variant="row" defaultExpanded><Text>Nota:</Text></Collapsible>);
  expect(screen.getByText('Nota:')).toBeOnTheScreen();
});

it('nests (trimester > subject)', async () => {
  await renderWithProviders(
    <Collapsible title="1º TRIMESTRE" variant="card">
      <Collapsible title="ARTE" variant="row"><Text>Faltas:</Text></Collapsible>
    </Collapsible>,
  );
  await fireEvent.press(screen.getByRole('button', { name: '1º TRIMESTRE' }));
  await fireEvent.press(screen.getByRole('button', { name: 'ARTE' }));
  expect(screen.getByText('Faltas:')).toBeOnTheScreen();
});
```

- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** Rodar → PASS.
- [ ] **Step 5: Commit** `feat(components): add animated collapsible for card and row`

### Task 8: `Dropdown`

**Files:**
- Create: `src/components/Dropdown/Dropdown.tsx`, `Dropdown.test.tsx`

**Interfaces:**
- Consumes: `Text`, `motion`, `chevron-down.svg`.
- Produces: `Dropdown<T>(props: { options: T[]; selected: T; onSelect: (option: T) => void; getLabel: (option: T) => string; getKey: (option: T) => string; accessibilityLabel: string }): JSX.Element`.

Visual: caixa `surface`, altura 45, raio `default`, padding horizontal `m`, label do selecionado `body` (`flex: 1`) + chevron 14 `accentText` girando ao abrir. Aberto: painel `surface`, raio `default`, posicionado `absolute` logo abaixo da caixa (`top: 45 + spacing.s`, `left: 0`, `right: 0`, `zIndex` alto, `elevation`), **flutuando por cima** do conteúdo seguinte; opções `body`, padding vertical `s` e horizontal `m`; `entering`/`exiting` `FadeIn`/`FadeOut` com `motion.duration.micro`. Tocar na caixa alterna; tocar numa opção chama `onSelect(option)` e fecha. Acessibilidade: caixa `accessibilityRole="button"`, `accessibilityLabel={accessibilityLabel}`, `accessibilityValue={{ text: getLabel(selected) }}`, `accessibilityState={{ expanded }}`; cada opção `accessibilityRole="button"`, `accessibilityState={{ selected }}`.

- [ ] **Step 1: Teste falhando**

```tsx
const years = [{ id: '2025', label: '7EF - 2025' }, { id: '2024', label: '6EF - 2024' }];
const setup = (onSelect = jest.fn()) =>
  renderWithProviders(
    <Dropdown options={years} selected={years[0]} onSelect={onSelect}
      getLabel={y => y.label} getKey={y => y.id} accessibilityLabel="Ano letivo" />,
  );

it('shows the selected option and keeps the list closed', async () => {
  await setup();
  expect(screen.getByRole('button', { name: 'Ano letivo' })).toHaveAccessibilityState({ expanded: false });
  expect(screen.getAllByText('7EF - 2025')).toHaveLength(1);
  expect(screen.queryByText('6EF - 2024')).toBeNull();
});

it('opens, marks the selected option, selects and closes', async () => {
  const onSelect = jest.fn();
  await setup(onSelect);
  await fireEvent.press(screen.getByRole('button', { name: 'Ano letivo' }));
  expect(screen.getByRole('button', { name: 'Ano letivo' })).toHaveAccessibilityState({ expanded: true });
  expect(screen.getByRole('button', { name: '7EF - 2025' })).toHaveAccessibilityState({ selected: true });
  await fireEvent.press(screen.getByRole('button', { name: '6EF - 2024' }));
  expect(onSelect).toHaveBeenCalledWith(years[1]);
  expect(screen.queryByRole('button', { name: '6EF - 2024' })).toBeNull();
});

it('closes when the box is pressed again', async () => {
  await setup();
  const box = screen.getByRole('button', { name: 'Ano letivo' });
  await fireEvent.press(box);
  await fireEvent.press(box);
  expect(screen.queryByText('6EF - 2024')).toBeNull();
});
```

- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** Rodar → PASS.
- [ ] **Step 5: Commit** `feat(components): add generic dropdown with floating options`

- [ ] **Task: Phase Verification & Checkpoint (Refer to workflow.md)** — verificação manual: render temporário (não commitado) de `Dropdown` sobre um `Collapsible` em Boletim, em iOS e Android, temas claro e escuro: painel cobre o card sem deslocá-lo; título longo quebra com chevron visível; "reduzir movimento" sem animações de escala.

---

## Fase 4: Documentação

### Task 9: README

- [ ] **Step 1:** Atualizar **Estrutura** (`src/components/`, `src/animations/`, `src/utils/`, `src/theme/motion.ts`) e **Status** (linha "Componentes base" ✅).
- [ ] **Step 2:** `yarn lint && yarn typecheck && CI=true yarn test --coverage` → PASS.
- [ ] **Step 3: Commit** `docs: update readme with base components`

- [ ] **Task: Phase Verification & Checkpoint (Refer to workflow.md)** — track concluída.

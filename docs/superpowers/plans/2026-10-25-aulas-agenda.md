# Tela de Aulas (agenda do aluno) — Implementation Plan

> **Para agentes executores:** este plano é registrado como track via `conductor-new-track` e executado com `conductor-implement` (num subagente), seguindo `conductor/workflow.md` (um commit por task com resumo de 3–5 linhas no corpo, SHA no `plan.md` da track). Steps usam checkbox (`- [ ]`).

**Goal:** A aba AGENDA mostra as aulas do aluno selecionado num dia da semana, com dropdown para trocar de dia e estado "Sem aulas neste dia", seguindo o Figma.

**Architecture:** Regras de data puras em `src/utils/agenda.ts` (rótulo por extenso e dia inicial). Hook `useAgenda` na pasta da tela junta sessão + dia escolhido; a tela `Aulas` só orquestra `Header`, título, `Dropdown` (já existe) e a lista (`AulaItem`) ou o vazio (`SemAulas`).

**Tech Stack:** Restyle, Reanimated 4 (layout animations `entering`), Zustand (sessão), RNTL 14 — tudo instalado.

**Spec:** `conductor/product.md` (seção Aulas) e `conductor/product-guidelines.md` (Aula, Agenda vazia, Dropdown, Textos do design, Animações). Figma `lS5jNff8UuWaPnOPZWxb8n`, página Aulas (`1:2`): frames "Aulas - Lista de aulas" `2:88`, "Aulas - Dropdown com dias" `2:48`, "Aulas - Sem aulas" `2:24`.

## Contexto

`Aulas.tsx` hoje é `Header` + texto "Aulas" centralizado. `Dropdown<T>` (`src/components/Dropdown/Dropdown.tsx`) recebe `options, selected, onSelect, getLabel, getKey, accessibilityLabel`; o painel aberto é absoluto e cobre o conteúdo abaixo. `useSession()` devolve `{ responsavel, aluno } | null`; `aluno.agenda` é `AgendaDia[]` (`{ dia: 'YYYY-MM-DD', aulas: { horario, disciplina }[] }`). Nos 3 alunos a agenda é a semana fixa 2025-03-16 (domingo) a 2025-03-22 (sábado); domingo e sábado sem aulas, segunda a sexta com 6. Imagem vazia: `src/assets/images/no-classes.png` (328×208).

## Não-objetivos

- Boletim, botão de tema, logo em melhor resolução.
- Gestos de swipe entre dias (o dropdown cobre a navegação entre dias).

## Decisões

| Decisão | Escolha | Origem |
|---|---|---|
| Dia inicial | Dia da agenda com o mesmo dia da semana de hoje (hoje domingo → `2025-03-16`); se nenhum bater, o primeiro dia | Usuário |
| Troca de aluno | Mantém o dia escolhido (mesma data); se o novo aluno não tiver a data, volta ao dia inicial | Minha escolha, aprovada |
| Rótulo do dia | Montado à mão: `{d} de {mês}, {dia-da-semana}`, dia sem zero à esquerda, meses e dias em minúsculas (`16 de março, domingo`, `17 de março, segunda-feira`, `22 de março, sábado`). Data lida de `'YYYY-MM-DD'` com `Date.UTC` + `getUTCDay()` — nunca `new Date('YYYY-MM-DD')` local nem `Intl` | Minha escolha, aprovada (evita fuso e diferença iOS/Android) |
| Animação | Ao trocar de dia (e na primeira exibição), itens entram com `FadeInDown` de `motion.duration.transition`, stagger de `motion.stagger` (40ms) por índice; vazio entra com `FadeIn`. Reanimated já respeita reduzir movimento do sistema por padrão (`ReduceMotion.System`) | Minha escolha, aprovada |
| Rolagem | Só a lista rola (`ScrollView`); `Header`, título e dropdown fixos | Minha escolha, aprovada |
| Ilustração | Decorativa (`accessible={false}`, sem label); o texto "Sem aulas neste dia" informa o estado | Acessibilidade |

## Medidas do Figma (414 de largura)

- `Header` atual termina 16 abaixo da linha do aluno (y 193). Título **AGENDA** (`sectionTitle`, centralizado) 48 abaixo do `Header` (`xxl`).
- Dropdown: 32 abaixo do título, margem lateral 24 (`l`), altura 45 (já no componente).
- Lista: 24 abaixo do dropdown (`l`); margem lateral 40 (alinha com o texto do dropdown). Item: marcador círculo 6×6, contorno 1 `marker`, sem preenchimento, centralizado na linha do horário; texto 10 à direita do marcador (`MARKER_GAP = 10`); horário `caption`, disciplina `bodyStrong` 8 abaixo (`s`); itens a cada 59 → 16 entre itens (`m`).
- Vazio: ilustração 20 abaixo do dropdown, largura até 328 (`maxWidth: 328`, `aspectRatio: 328 / 208`, centralizada); "Sem aulas neste dia" (`emptyState`, centralizado) 20 abaixo da ilustração.
- Valores sem token viram constantes nomeadas no arquivo (como no Login): `TITLE_TO_DROPDOWN = 32`, `EMPTY_GAP = 20`, `MARKER_SIZE = 6`, `MARKER_GAP = 10`, `EMPTY_IMAGE = { maxWidth: 328, aspectRatio: 328 / 208 }`.

## Critérios de aceite

1. Aba AGENDA mostra cabeçalho, título AGENDA, dropdown com o dia por extenso e as aulas do dia (horário + disciplina) na ordem do JSON.
2. Abre no dia da semana de hoje dentro da semana dos dados.
3. Dropdown lista os 7 dias; escolher um troca a lista com animação.
4. Dia sem aulas mostra ilustração + "Sem aulas neste dia".
5. Trocar de aluno mantém o dia e mostra as aulas do novo aluno.
6. Lista rola em tela pequena sem mover cabeçalho e dropdown.

## Global Constraints

- Named exports; `type Props`; um componente por arquivo; testes ao lado do código.
- Só tokens do tema/`motion`; valores do Figma sem token como constantes nomeadas; textos exatamente como em "Textos do design" (`AGENDA`, `Sem aulas neste dia`, `{d} de {mês}, {dia-da-semana}`).
- Selecionar fatias da store; sem `useEffect` para estado derivado (dia efetivo calculado no render).
- RNTL 14 assíncrono (`await`); telas via `renderWithProviders`; consultar por role/texto/label.
- Commits Conventional Commits, subject minúsculo, corpo 3–5 linhas, **sem `Co-Authored-By` ou atribuição**. Nunca adicionar `docs/superpowers/plans/` aos commits.

## Review Focus

1. **Fuso horário**: `'2025-03-16'` em fuso negativo (Brasil) não pode virar sábado 15. Teste na Task 1 (usa `getUTCDay`, independente do fuso do processo).
2. **Agenda vazia ou sem o dia da semana de hoje** → primeiro dia / sem quebrar. Teste na Task 1.
3. **Troca de aluno com dia escolhido** → mantém a data. Teste na Task 2.
4. **Dropdown aberto sobre a lista** → painel fica por cima (zIndex já no componente; lista é irmã posterior). Verificação manual na Fase 2.
5. **Fonte grande do sistema** → disciplina longa ("Produção e Interpretação de Textos") quebra linha sem cortar. Verificação manual na Fase 2.

---

## Fase 1: Lógica da agenda

### Task 1: Utilitários de data da agenda

**Files:**
- Create: `src/utils/agenda.ts`, `src/utils/agenda.test.ts`

**Interfaces:**
- Produces: `formatDayLabel(dia: string): string`; `initialDay(agenda: AgendaDia[], today: Date): AgendaDia | null` (compara `today.getDay()` local com o dia da semana UTC de cada `dia`).

- [ ] **Step 1: Testes que falham**

```ts
it('formats the day label in portuguese', () => {
  expect(formatDayLabel('2025-03-16')).toBe('16 de março, domingo');
  expect(formatDayLabel('2025-03-17')).toBe('17 de março, segunda-feira');
  expect(formatDayLabel('2025-03-22')).toBe('22 de março, sábado');
  expect(formatDayLabel('2025-01-05')).toBe('5 de janeiro, domingo');
});

it('picks the agenda day matching today weekday', () => {
  expect(initialDay(agenda, new Date(2026, 9, 25))?.dia).toBe('2025-03-16'); // domingo
  expect(initialDay(agenda, new Date(2026, 9, 27))?.dia).toBe('2025-03-18'); // terça
});

it('falls back to the first day or null', () => {
  const weekdays = agenda.filter(d => d.dia !== '2025-03-16');
  expect(initialDay(weekdays, new Date(2026, 9, 25))?.dia).toBe('2025-03-17');
  expect(initialDay([], new Date(2026, 9, 25))).toBeNull();
});
```
`agenda` = os 7 dias `2025-03-16`…`2025-03-22` com `aulas: []`.

- [ ] **Step 2:** `CI=true yarn test src/utils/agenda` → FAIL (módulo não existe).
- [ ] **Step 3:** Implementar em `src/utils/agenda.ts` (arrays `MONTHS`/`WEEKDAYS` em português; parse manual de `YYYY-MM-DD` + `Date.UTC`).
- [ ] **Step 4:** Rodar de novo → PASS.
- [ ] **Step 5: Commit** `feat(agenda): add day label and initial day helpers`

### Task 2: `useAgenda`

**Files:**
- Create: `src/screens/Aulas/useAgenda.ts`, `src/screens/Aulas/useAgenda.test.tsx`
- Modify: `src/theme/motion.ts` (adicionar `stagger: 40`)

**Interfaces:**
- Consumes: `useSession()`, `initialDay`.
- Produces: `useAgenda(): { days: AgendaDia[]; selectedDay: AgendaDia | null; selectDay: (day: AgendaDia) => void }`. Estado local guarda só a data escolhida (`string | null`); `selectedDay` = dia com essa data na agenda atual ?? `initialDay(agenda, new Date())`. Sem sessão → `days: []`, `selectedDay: null`.

- [ ] **Step 1: Testes que falham** (`renderHook` do RNTL com wrapper de providers; `jest.useFakeTimers({ now: new Date(2026, 9, 27) })`; sessão `signIn(1, 12567)`)

```ts
it('starts on the day matching today weekday', ...);        // selectedDay.dia === '2025-03-18', days.length === 7
it('selects another day', ...);                             // selectDay(days[0]) → selectedDay.dia === '2025-03-16'
it('keeps the selected day when switching student', ...);   // selectDay(days[3]); act(selectAluno(12568)) → dia '2025-03-19', aulas[0].disciplina da Joana
```

- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** Rodar → PASS.
- [ ] **Step 5: Commit** `feat(agenda): add agenda hook with day selection`

- [ ] **Task: Phase Verification & Checkpoint (Refer to workflow.md)** — só automatizada (sem tela).

## Fase 2: Tela

### Task 3: Item de aula e estado vazio

**Files:**
- Create: `src/screens/Aulas/AulaItem.tsx`, `src/screens/Aulas/SemAulas.tsx`, testes ao lado

**Interfaces:**
- Produces: `AulaItem({ aula, index }: { aula: Aula; index: number })` — `Animated.View` com `entering={FadeInDown.duration(motion.duration.transition).delay(index * motion.stagger)}`; `SemAulas()` — ilustração + texto, `entering={FadeIn.duration(motion.duration.transition)}`.

- [ ] **Step 1: Testes que falham**

```ts
it('shows time and subject', ...);        // getByText('07:15 - 08:00'), getByText('Matemática I')
it('shows the empty message', ...);       // getByText('Sem aulas neste dia')
```

- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Implementar com as medidas da seção "Medidas do Figma" (marcador `Box` 6×6, `borderRadius` metade, `borderWidth` 1, `borderColor="marker"`).
- [ ] **Step 4:** Rodar → PASS.
- [ ] **Step 5: Commit** `feat(agenda): add class item and empty day components`

### Task 4: Tela de Aulas

**Files:**
- Modify: `src/screens/Aulas/Aulas.tsx`, `src/screens/Aulas/Aulas.test.tsx`

**Interfaces:**
- Consumes: `useAgenda`, `Dropdown`, `formatDayLabel`, `AulaItem`, `SemAulas`, `Header`.

Estrutura: `Header` → `AGENDA` → `Dropdown` (`getLabel = d => formatDayLabel(d.dia)`, `getKey = d => d.dia`, `accessibilityLabel="Dia da agenda"`) → `ScrollView` (flex 1) com `AulaItem`s ou `SemAulas`. O container da lista recebe `key={selectedDay.dia}` para remontar e reanimar ao trocar de dia. `selectedDay` null → só `Header` + título (sem dropdown).

- [ ] **Step 1: Testes que falham** (fake now `2026-10-27`, sessão `signIn(1, 12567)`)

```ts
it('shows the classes of today weekday', async () => {
  await renderWithProviders(<Aulas />);
  expect(screen.getByText('AGENDA')).toBeOnTheScreen();
  expect(screen.getByText('18 de março, terça-feira')).toBeOnTheScreen();
  expect(screen.getAllByText(/^\d{2}:\d{2} - \d{2}:\d{2}$/)).toHaveLength(6);
  expect(screen.getByText('Matemática II')).toBeOnTheScreen();
});

it('switches day from the dropdown', async () => {
  await renderWithProviders(<Aulas />);
  await fireEvent.press(screen.getByRole('button', { name: 'Dia da agenda' }));
  await fireEvent.press(screen.getByRole('button', { name: '16 de março, domingo' }));
  expect(screen.getByText('Sem aulas neste dia')).toBeOnTheScreen();
});
```
Manter a asserção do cabeçalho existente (`SAIR`) e remover a do texto "Aulas".

- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** `yarn lint && yarn typecheck && CI=true yarn test` → PASS.
- [ ] **Step 5: Commit** `feat(agenda): show student schedule with day selection`

- [ ] **Task: Phase Verification & Checkpoint (Refer to workflow.md)** — manual em iOS e Android pelo usuário: medidas vs Figma, dropdown por cima da lista, animação ao trocar de dia, vazio no domingo/sábado, troca de aluno mantendo o dia, rolagem em tela pequena, fonte grande.

## Fase 3: Documentação

### Task 5: README

- [ ] **Step 1:** **Estrutura** (`src/utils/agenda.ts`; `screens/Aulas/` com `useAgenda`, `AulaItem`, `SemAulas` se a seção listar arquivos nesse nível) e **Status** (linha "Agenda de aulas" ✅).
- [ ] **Step 2:** `yarn lint && yarn typecheck && CI=true yarn test --coverage` → PASS.
- [ ] **Step 3: Commit** `docs: update readme with class schedule`

- [ ] **Task: Phase Verification & Checkpoint (Refer to workflow.md)** — track concluída.

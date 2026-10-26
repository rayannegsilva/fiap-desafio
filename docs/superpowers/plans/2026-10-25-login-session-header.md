

# Dados, sessão, Login, cabeçalho e Troca de aluno — Implementation Plan

> **Para agentes executores:** este plano é registrado como track via `conductor-new-track` e executado com `conductor-implement` (num subagente), seguindo `conductor/workflow.md` (um commit por task com resumo de 3–5 linhas no corpo, SHA no `plan.md` da track). Steps usam checkbox (`- [ ]`).

**Goal:** Responsável entra com CPF e senha, a sessão fica salva (reabre direto em Aulas), Aulas e Boletim ganham o cabeçalho do design (saudação, aluno, TROCAR PERFIL, SAIR) e a troca de aluno funciona de verdade.

**Architecture:** Camada de dados em `src/data/` (tipos + repositório sobre `responsaveis.json`, telas não conhecem o JSON). Sessão em store Zustand persistida só com ids. `RootNavigator` vira auth flow do React Navigation: telas condicionais à sessão (sem sessão → `Login`; com sessão → `Main` + `TrocaAluno`), então entrar/sair troca de tela sem navegação manual. Lógica do formulário num hook (`useLoginForm`); telas só orquestram.

**Tech Stack:** React Navigation 7 (native-stack), Zustand 5 + AsyncStorage (`persist`), Restyle, Reanimated 4, RNTL 14 — tudo instalado. Componentes de `src/components/` (Text, PrimaryButton, TextButton, TextField).

**Spec:** design em `conductor/product.md` (Autenticação, Área autenticada, Seleção de aluno, Estados de erro) e `conductor/product-guidelines.md` (Cabeçalho, Login, Troca de aluno, Textos do design, Dados e privacidade). Medidas abaixo vêm do Figma (frames de 414 de largura).

## Contexto

Os componentes base existem (track arquivada `base_components_20261024`). As telas são placeholders e a navegação usa dois botões temporários ("Entrar (temporário)" em Login e "Trocar aluno (temporário)" em Aulas), removidos aqui. Os dados estão em `src/data/responsaveis.json`: 2 responsáveis, campos `id, cpf (só dígitos), email, senha, primeiroNome, sobrenome, alunos[]`; aluno `rm, turma, periodo, primeiroNome, sobrenome, agenda[], boletim[]`. Responsável 1 (CPF `96929456004`, senha `123456`) tem 2 alunos (Rafael 7EF/12567, Joana 2EM/12568); responsável 2 (CPF `50879567007`, senha `987654`) tem 1 (Bianca 1EF/13752).

## Não-objetivos

- Conteúdo real de Aulas (lista/dropdown de dias) e Boletim (trimestres): próximas tracks.
- Botão de tema claro/escuro (sem desenho no Figma; decidido depois).
- Splash animada, recuperação de senha, cadastro, backend.

## Decisões

| Decisão | Escolha | Motivo |
|---|---|---|
| Navegação | Auth flow: `RootNavigator` renderiza `Login` **ou** `Main`+`TrocaAluno` conforme a sessão | Padrão do React Navigation; SAIR e entrar trocam de tela sozinhos |
| Reidratação | Enquanto a store não reidratou, `RootNavigator` não renderiza telas (`null`) | Evita piscar o Login para quem já tem sessão |
| Sessão | Store persistida com `responsavelId` e `alunoRm` (nunca senha nem CPF) | `product-guidelines.md` — privacidade |
| Sessão órfã | `responsavelId` persistido que não existe mais nos dados → sessão é limpa → Login | Robustez |
| Aluno inicial | Primeiro aluno do responsável no login | Sem regra no design |
| `authenticate` | Assíncrona com atraso de 600 ms (`AUTH_DELAY_MS`) | Representa a chamada de rede e permite o estado "carregando" do design |
| CPF | Comparado só pelos dígitos; campo usa `formatCpf` e teclado numérico | Máscara não interfere |
| Erro de login | Genérico `Usuário ou senha inválida. Pode tentar novamente?` no campo SENHA (com shake); editar qualquer campo limpa o erro | Texto do design; resolve o shake que não repetia com a mesma mensagem |
| Sem alunos | Login com responsável sem alunos não entra e mostra `Nenhum aluno vinculado a este responsável.` | `product.md` pede mensagem clara; **texto fora do design** (registrar na spec da track) |
| Ícone do `TextButton` | Depois do texto (SAIR + ícone 10; FECHAR + X 24) | Figma; hoje está antes |
| Saudação | Nova variante de texto `greetingName` (24/29 Bold `textPrimary`) para o nome em "Olá, **NOME**" | Guidelines: nome em negrito; sem fonte solta |
| Espaçamento 36 | Novo token `xl2: 36` | Distância saudação → aluno no Figma |
| Troca de aluno | Rota `TrocaAluno` com `animation: 'slide_from_bottom'`; tocar num card seleciona e volta (`goBack`) | FECHAR sugere tela sobreposta |
| Borda do aluno atual | `borderWidth: 2`, `borderColor: 'accent'` | Guidelines dizem "borda accent"; espessura não medida — conferir no checkpoint |

## Medidas do Figma (414 de largura)

- **Login:** logo 306×49 centralizado, topo a 100; campos com margem lateral 48; rótulo (`label`) centralizado no topo do campo, valor (`inputValue`) centralizado, sublinhado no fim — campo de 96 de altura; 40 entre CPF e SENHA; erro (`error`, 2 linhas centralizadas) 32 abaixo do sublinhado da SENHA; FAZER LOGIN largura total, 60 de altura, colado na base.
- **Cabeçalho (177):** barra de ações 48 (fundo `background`): logo 100×16 em x16/y16; à direita (margem 16) TROCAR PERFIL e SAIR com 24 entre eles, texto `caption`; SAIR com ícone `logout.svg` 10 **depois** do texto (gap 4). "Olá, NOME" (`greeting` + `greetingName`) centralizado 16 abaixo da barra; nome do aluno (`bodyMedium`, primeiro nome em caixa alta) 36 abaixo da saudação; linha `{TURMA} - RM {RM} - {Período}` (`body`) 8 abaixo.
- **Troca de aluno:** FECHAR (`cardTitle`) + X 24 (gap 8) no topo à direita (margem 16, topo 16); título "Escolha o perfil que você quer visualizar" (`screenTitle`, centralizado, padding lateral 48) com topo a ~209; cards 64 abaixo do título, 90 de altura, 16 entre eles, margem lateral 16, raio `default`, fundo `surfaceRaised`, padding 16; nome completo em caixa alta (`bodyMedium`) no topo, linha do aluno (`body`) na base.

## Critérios de aceite

1. CPF `969.294.560-04` + senha `123456` → Aulas com "Olá, GUSTAVO", "RAFAEL", "7EF - RM 12567 - Matutino", TROCAR PERFIL e SAIR.
2. Credencial errada → mensagem genérica com shake; editar limpa a mensagem; FAZER LOGIN desabilitado até CPF completo (11 dígitos) e senha preenchida; carregando mostra o indicador.
3. Fechar e reabrir o app com sessão → abre em Aulas sem passar pelo Login.
4. TROCAR PERFIL → lista Rafael e Joana (Rafael com borda); escolher Joana → volta com "JOANA" / "2EM - RM 12568 - Matutino"; FECHAR volta sem trocar.
5. Responsável 2 (um aluno) → cabeçalho sem TROCAR PERFIL.
6. SAIR → Login, sessão apagada (reabrir abre no Login).
7. AsyncStorage nunca contém senha nem CPF.
8. Botões temporários removidos; `yarn lint`, `yarn typecheck`, `CI=true yarn test --coverage` (≥ 80%) passam.

## Global Constraints

- Named exports; `type Props`; um componente por arquivo; telas em `src/screens/<Nome>/<Nome>.tsx` com teste ao lado.
- Só tokens do tema/`motion`; textos exatamente como em "Textos do design" de `product-guidelines.md`; nomes no cabeçalho só o primeiro nome, em caixa alta.
- Selecionar fatias da store (`useSessionStore(s => s.x)`), nunca a store inteira; sem `useEffect` para estado derivado.
- RNTL 14 assíncrono (`await`); testes de tela via `renderWithProviders`; consultar por role/texto/label.
- Commits Conventional Commits, subject minúsculo, corpo 3–5 linhas, **sem linha `Co-Authored-By` ou atribuição**.

## Review Focus

1. **Sessão órfã** (id salvo que não existe nos dados) → app abre no Login, não quebra. Teste na Task 3.
2. **Toque repetido em FAZER LOGIN durante o carregamento** → uma única autenticação. Teste na Task 5.
3. **CPF incompleto** (10 dígitos) com senha → botão desabilitado. Teste na Task 5.
4. **Reabrir com sessão** → não renderiza o Login antes de reidratar. Teste na Task 6.
5. **Persistência** nunca guarda senha/CPF. Teste na Task 3.

---

## Fase 1: Dados e sessão

### Task 1: Tipos e repositório

**Files:**
- Create: `src/data/types.ts`, `src/data/repository.ts`, `src/data/repository.test.ts`

**Interfaces:**
- Produces (`types.ts`): `Aula = { horario: string; disciplina: string }`, `AgendaDia = { dia: string; aulas: Aula[] }`, `Disciplina = { nome: string; nota: number | null; faltas: number | null }` (`null` = trimestre não avaliado), `Trimestre = { trimestre: number; disciplinas: Disciplina[] }`, `Boletim = { ano: string; turma: string; trimestres: Trimestre[] }`, `Aluno = { rm: number; turma: string; periodo: string; primeiroNome: string; sobrenome: string; agenda: AgendaDia[]; boletim: Boletim[] }`, `Responsavel = { id: number; cpf: string; email: string; primeiroNome: string; sobrenome: string; alunos: Aluno[] }` (**sem** `senha`).
- Produces (`repository.ts`): `AUTH_DELAY_MS = 600`; `authenticate(cpf: string, senha: string): Promise<Responsavel | null>` (compara dígitos do CPF e senha; resolve após `AUTH_DELAY_MS`; nunca devolve a senha); `getResponsavel(id: number): Responsavel | null`.

- [ ] **Step 1: Teste falhando**

```ts
beforeEach(() => jest.useFakeTimers());

async function auth(cpf: string, senha: string) {
  const promise = authenticate(cpf, senha);
  jest.advanceTimersByTime(AUTH_DELAY_MS);
  return promise;
}

it('authenticates with masked or raw cpf and never returns the password', async () => {
  const masked = await auth('969.294.560-04', '123456');
  expect(masked?.primeiroNome).toBe('Gustavo');
  expect(masked).not.toHaveProperty('senha');
  expect((await auth('96929456004', '123456'))?.id).toBe(1);
});

it('rejects wrong password or unknown cpf', async () => {
  expect(await auth('96929456004', '000000')).toBeNull();
  expect(await auth('11111111111', '123456')).toBeNull();
});

it('finds a responsavel by id and returns null for unknown ids', () => {
  expect(getResponsavel(2)?.alunos.map(a => a.primeiroNome)).toEqual(['Bianca']);
  expect(getResponsavel(999)).toBeNull();
});
```

- [ ] **Step 2:** `CI=true yarn test repository.test` → FAIL.
- [ ] **Step 3:** Implementar. Importar o JSON (`resolveJsonModule` já ativo) e remover `senha` ao montar o `Responsavel` devolvido.
- [ ] **Step 4:** Rodar → PASS.
- [ ] **Step 5: Commit** `feat(data): add typed repository over embedded json`

### Task 2: Formatadores de aluno

**Files:**
- Create: `src/utils/student.ts`, `src/utils/student.test.ts`

**Interfaces:**
- Produces: `studentFirstName(aluno: Aluno): string` (caixa alta), `studentFullName(aluno: Aluno): string` (`"RAFAEL DA SILVA"`), `studentInfoLine(aluno: Aluno): string` (`"7EF - RM 12567 - Matutino"`), `guardianFirstName(responsavel: Responsavel): string` (`"GUSTAVO"`).

- [ ] **Step 1: Teste falhando** — com `getResponsavel(1)!` (aluno Rafael): `studentFirstName → 'RAFAEL'`, `studentFullName → 'RAFAEL DA SILVA'`, `studentInfoLine → '7EF - RM 12567 - Matutino'`, `guardianFirstName → 'GUSTAVO'`.
- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Implementar (`toLocaleUpperCase('pt-BR')`).
- [ ] **Step 4:** Rodar → PASS.
- [ ] **Step 5: Commit** `feat(utils): add student display formatters`

### Task 3: Store de sessão

**Files:**
- Create: `src/store/useSessionStore.ts`, `src/store/useSessionStore.test.ts`, `src/store/useSession.ts`, `src/store/useSession.test.tsx`

**Interfaces:**
- Consumes: `getResponsavel` (Task 1).
- Produces: `useSessionStore` (Zustand + `persist`, `name: 'session-storage'`, AsyncStorage): `{ responsavelId: number | null; alunoRm: number | null; signIn(responsavelId: number, alunoRm: number): void; selectAluno(rm: number): void; signOut(): void }`.
- Produces: `useSessionHydrated(): boolean` (usa `useSessionStore.persist.hasHydrated()` / `onFinishHydration`).
- Produces: `useSession(): { responsavel: Responsavel; aluno: Aluno } | null` — resolve ids via `getResponsavel`; `null` sem sessão; se o responsável não existir ou o RM não pertencer a ele, chama `signOut()` (em `useEffect`, uma vez) e devolve `null`.

- [ ] **Step 1: Testes falhando**

```ts
it('signs in, switches student and signs out', async () => {
  await act(() => useSessionStore.getState().signIn(1, 12567));
  expect(useSessionStore.getState()).toMatchObject({ responsavelId: 1, alunoRm: 12567 });
  await act(() => useSessionStore.getState().selectAluno(12568));
  expect(useSessionStore.getState().alunoRm).toBe(12568);
  await act(() => useSessionStore.getState().signOut());
  expect(useSessionStore.getState()).toMatchObject({ responsavelId: null, alunoRm: null });
});

it('persists only ids, never cpf or password', async () => {
  await act(() => useSessionStore.getState().signIn(1, 12567));
  const raw = (await AsyncStorage.getItem('session-storage'))!;
  expect(JSON.parse(raw).state).toEqual({ responsavelId: 1, alunoRm: 12567 });
  expect(raw).not.toMatch(/123456|96929456004/);
});
```

`useSession.test.tsx`: resolve Gustavo/Rafael após `signIn(1, 12567)`; devolve `null` sem sessão; com `signIn(999, 1)` devolve `null` e limpa a store (`responsavelId` volta a `null`).

- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Implementar. `partialize` para persistir só `responsavelId` e `alunoRm`.
- [ ] **Step 4:** Rodar → PASS.
- [ ] **Step 5: Commit** `feat(store): add persisted session with student selection`

- [ ] **Task: Phase Verification & Checkpoint (Refer to workflow.md)** — só automatizada (sem tela nesta fase).

---

## Fase 2: Login

### Task 4: Ícone do `TextButton` depois do texto

**Files:**
- Modify: `src/components/TextButton/TextButton.tsx`, `TextButton.test.tsx`

- [ ] **Step 1: Teste falhando** — renderizar `<TextButton label="SAIR" icon={Logout} iconSize={10} onPress={jest.fn()} />` e afirmar que, entre os filhos da linha, o texto vem antes do ícone (ex.: índice do nó com `testID="text-button-icon"` maior que o do texto).
- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Mover o ícone para depois do `Text`. Gap: `xs` (4) para `caption`, `s` (8) para `cardTitle` (FECHAR).
- [ ] **Step 4:** Rodar → PASS.
- [ ] **Step 5: Commit** `fix(components): place text button icon after the label`

### Task 5: `useLoginForm`

**Files:**
- Create: `src/screens/Login/useLoginForm.ts`, `src/screens/Login/useLoginForm.test.ts`

**Interfaces:**
- Consumes: `authenticate`, `formatCpf`, `useSessionStore` (`signIn`).
- Produces: `useLoginForm(): { cpf: string; senha: string; setCpf(value: string): void; setSenha(value: string): void; canSubmit: boolean; loading: boolean; error: string | null; submit(): Promise<void> }`. `setCpf` aplica `formatCpf`; qualquer `set*` limpa `error`; `canSubmit` = CPF com 11 dígitos && senha não vazia && !loading; `submit` ignora chamadas com `!canSubmit`; sucesso → `signIn(responsavel.id, responsavel.alunos[0].rm)`; falha → `error = 'Usuário ou senha inválida. Pode tentar novamente?'`; responsável sem alunos → `error = 'Nenhum aluno vinculado a este responsável.'`.

- [ ] **Step 1: Testes falhando** (`renderHook`, fake timers, avançar `AUTH_DELAY_MS`):
  - masks the cpf as it is typed (`setCpf('96929456004')` → `cpf === '969.294.560-04'`);
  - keeps submit disabled until cpf has 11 digits and password is filled (10 dígitos + senha → `false`; 11 + senha → `true`);
  - signs in with the first student on success (`useSessionStore.getState()` → `{ responsavelId: 1, alunoRm: 12567 }`);
  - shows the generic error on failure and clears it when a field changes;
  - authenticates only once when submit is called twice while loading (espionar `authenticate` com `jest.spyOn(repository, 'authenticate')` e esperar 1 chamada).
- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** Rodar → PASS.
- [ ] **Step 5: Commit** `feat(login): add login form state hook`

### Task 6: Tela de Login e auth flow

**Files:**
- Modify: `src/screens/Login/Login.tsx`, `src/screens/Login/Login.test.tsx`, `src/routes/RootNavigator.tsx`, `src/routes/RootNavigator.test.tsx`, `src/App.test.tsx`

**Interfaces:**
- Consumes: `useLoginForm`, `useSessionStore`, `useSessionHydrated`, `TextField`, `PrimaryButton`, `src/assets/images/logo.png`.

Tela (medidas em "Medidas do Figma"): fundo `background`, safe area; `KeyboardAvoidingView` (iOS `padding`) para o botão subir com o teclado; logo 306×49 (`accessibilityLabel="FIAP School"`, `accessibilityRole="image"`); `TextField label="CPF"` (`keyboardType="number-pad"`, `returnKeyType="next"`) e `TextField label="SENHA"` (`secureTextEntry`, `returnKeyType="done"`, `onSubmitEditing={submit}`, `error={error}`); `PrimaryButton label="FAZER LOGIN" disabled={!canSubmit} loading={loading}` colado na base, com o fundo estendido até a borda inferior (padding inferior = inset). Remove o botão temporário.

`RootNavigator`: `hydrated = useSessionHydrated()`; `signedIn = useSessionStore(s => s.responsavelId !== null)`; `!hydrated` → `null`; senão `Stack.Navigator` com `signedIn ? <Main/><TrocaAluno options={{ animation: 'slide_from_bottom' }}/> : <Login/>` (remover `initialRouteName`).

- [ ] **Step 1: Testes falhando**
  - `Login.test.tsx`: FAZER LOGIN desabilitado no início; digitar `96929456004` e `123456`, tocar → botão `busy` (`toBeBusy()`), avançar `AUTH_DELAY_MS` → store com `responsavelId: 1`; credencial errada → mostra `Usuário ou senha inválida. Pode tentar novamente?`.
  - `RootNavigator.test.tsx` (substitui o teste dos botões temporários): sem sessão mostra o campo `CPF` (`getByLabelText('CPF')`); com `signIn(1, 12567)` antes de renderizar e store reidratada, abre em `Main` e **não** mostra o Login em nenhum momento (`queryByLabelText('CPF')` nulo desde o primeiro render); login válido pela tela leva para `Main`.
  - `App.test.tsx`: sem sessão abre no Login (campo `CPF`).
- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** Rodar → PASS.
- [ ] **Step 5: Commit** `feat(login): add login screen and session-based navigation`

- [ ] **Task: Phase Verification & Checkpoint (Refer to workflow.md)** — manual em iOS e Android: estados inicial, CPF com máscara, botão ativo, carregando, erro com shake; teclado não cobre o botão; login válido abre Aulas; fechar e reabrir o app abre em Aulas.

---

## Fase 3: Cabeçalho e troca de aluno

### Task 7: Cabeçalho

**Files:**
- Create: `src/components/Header/Header.tsx`, `src/components/Header/Header.test.tsx`
- Modify: `src/theme/theme.ts` (`textVariants.greetingName`, `spacing.xl2: 36`), `src/screens/Aulas/Aulas.tsx`, `src/screens/Aulas/Aulas.test.tsx`, `src/screens/Boletim/Boletim.tsx`, `src/screens/Boletim/Boletim.test.tsx`

**Interfaces:**
- Consumes: `useSession`, `useSessionStore` (`signOut`), formatadores (Task 2), `TextButton` (Task 4), `logout.svg`, `logo.png`, navegação raiz (`navigate('TrocaAluno')`).
- Produces: `Header(): JSX.Element | null` (sem props; `null` sem sessão).

Visual em "Medidas do Figma". Safe area no topo (fundo `background` cobre a status bar). TROCAR PERFIL só se `responsavel.alunos.length > 1`. SAIR → `signOut()`. Saudação: `<Text variant="greeting">Olá, <Text variant="greetingName">{guardianFirstName}</Text></Text>`; nome do aluno com `accessibilityRole="header"`. Aulas e Boletim: `Header` no topo, título da tela abaixo (placeholder atual); remover o botão temporário de Aulas.

- [ ] **Step 1: Testes falhando** (`Header.test.tsx`, com sessão pré-carregada na store)
  - shows greeting, student and info line for responsável 1 (`Olá, GUSTAVO`, `RAFAEL`, `7EF - RM 12567 - Matutino`);
  - shows TROCAR PERFIL only when the guardian has more than one student (responsável 2 → `queryByRole('button', { name: 'TROCAR PERFIL' })` nulo);
  - SAIR signs out (store com `responsavelId: null`).
  - `Aulas.test.tsx` / `Boletim.test.tsx`: renderizam o cabeçalho (com sessão) e não têm mais botão temporário.
- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** Rodar → PASS.
- [ ] **Step 5: Commit** `feat(header): add authenticated header with student info and actions`

### Task 8: Troca de aluno

**Files:**
- Modify: `src/screens/TrocaAluno/TrocaAluno.tsx`, `src/screens/TrocaAluno/TrocaAluno.test.tsx`, `src/routes/RootNavigator.test.tsx`

**Interfaces:**
- Consumes: `useSession`, `useSessionStore` (`selectAluno`), formatadores, `TextButton` (FECHAR, `variant="cardTitle"`, `icon={Close}`, `iconSize={24}`), `usePressScale`, `navigation.goBack()`.

Visual em "Medidas do Figma". Card por aluno: `Pressable` com `accessibilityRole="button"`, `accessibilityLabel={studentFullName(aluno)}`, `accessibilityState={{ selected }}`, `usePressScale`; aluno atual com `borderWidth: 2`, `borderColor: 'accent'`. Tocar → `selectAluno(rm)` e `goBack()`. FECHAR → `goBack()`.

- [ ] **Step 1: Testes falhando**
  - `TrocaAluno.test.tsx`: lista `RAFAEL DA SILVA` (selecionado) e `JOANA DA SILVA` com as linhas `7EF - RM 12567 - Matutino` / `2EM - RM 12568 - Matutino`; tocar em Joana chama `selectAluno` (store com `alunoRm: 12568`) e `goBack`; FECHAR chama `goBack` sem trocar.
  - `RootNavigator.test.tsx` ponta a ponta: login válido → `Olá, GUSTAVO` → TROCAR PERFIL → escolher Joana → cabeçalho mostra `JOANA` e `2EM - RM 12568 - Matutino` → SAIR → campo `CPF` de volta.
- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** Rodar → PASS.
- [ ] **Step 5: Commit** `feat(student-switch): add student selection screen`

- [ ] **Task: Phase Verification & Checkpoint (Refer to workflow.md)** — manual em iOS e Android: cabeçalho fiel ao Figma (responsável 1 e 2), TROCAR PERFIL → troca → volta atualizado, FECHAR, SAIR → Login e reabrir no Login; espessura da borda do aluno atual.

---

## Fase 4: Documentação

### Task 9: README

- [ ] **Step 1:** Atualizar **Estrutura** (`src/data/`, `src/store/useSessionStore.ts`, `src/components/Header/`, `src/utils/student.ts`), **Status** (linha "Login, sessão, cabeçalho e troca de aluno" ✅) e uma seção curta **Acesso de demonstração** com os dois CPFs/senhas do JSON (dados fictícios embarcados).
- [ ] **Step 2:** `yarn lint && yarn typecheck && CI=true yarn test --coverage` → PASS.
- [ ] **Step 3: Commit** `docs: update readme with login and session`

- [ ] **Task: Phase Verification & Checkpoint (Refer to workflow.md)** — track concluída.

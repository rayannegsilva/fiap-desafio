# Identificadores em inglês e código sem comentários — Implementation Plan

> **Para agentes executores:** este plano é registrado como track via `conductor-new-track` e executado com `conductor-implement` (num subagente), seguindo `conductor/workflow.md` (um commit por task com resumo de 3–5 linhas no corpo, SHA no `plan.md` da track). Steps usam checkbox (`- [ ]`).

**Goal:** Padronizar o código em inglês (arquivos, pastas, telas, rotas, componentes, funções, hooks, tipos, variáveis) e remover os comentários do código, sem mudar comportamento nem textos da interface.

**Architecture:** Refactor puro em 3 camadas (dados/sessão → utilitários → telas/rotas), cada uma num commit que compila e passa nos testes. Arquivos renomeados com `git mv` para manter o histórico. Nenhuma camada de tradução: o JSON e os campos que o espelham continuam como estão.

**Tech Stack:** TypeScript, Jest/RNTL — nada novo.

**Spec:** decisão do usuário (2026-10-25): "o json fica como está, e o tratamento dos dados também. mas o nome de funções, de telas, de tipos, em inglês"; "vamos manter sem os comentários no código".

## Pré-requisito

Track **Boletim** (`boletim_20261025`) fechada e arquivada antes de começar — o refactor mexe nos mesmos arquivos.

## Regras

- **Fica como está:** `src/data/responsaveis.json` (nome e chaves) e os **campos** dos tipos que espelham o JSON (`id, cpf, email, senha, primeiroNome, sobrenome, alunos, rm, turma, periodo, agenda, dia, aulas, horario, disciplina, boletim, ano, trimestres, trimestre, disciplinas, nome, nota, faltas`).
- **Fica em português:** todo texto visível ou lido por leitor de tela (`AGENDA`, `BOLETIM`, `Sem aulas neste dia`, `accessibilityLabel="Dia da agenda"`, `"Ano do boletim"`, mensagens de erro etc.).
- **Vai para inglês:** todo o resto — nomes de arquivos/pastas, componentes, telas, rotas, funções, hooks, tipos, parâmetros, variáveis locais, testIDs e nomes de teste.
- **Comentários:** remover todos os `//` e `/* */` de `src/` (inclusive testes), exceto diretivas de ferramenta (`eslint-disable…`, `@ts-expect-error`). O porquê vai no corpo do commit.
- Sessão salva usa chaves novas (`guardianId`, `studentRm`): quem estava logado volta ao Login uma vez — aceito pelo usuário, sem migração.

## Mapa de nomes

| Antes | Depois |
|---|---|
| tipos `Responsavel`, `Aluno`, `Aula`, `AgendaDia`, `Boletim`, `Trimestre`, `Disciplina` | `Guardian`, `Student`, `Lesson`, `ScheduleDay`, `ReportCard`, `Term`, `Subject` |
| `getResponsavel(id)` | `getGuardian(id)` |
| `authenticate(cpf, senha)` (parâmetro), `Registro`, `registros`, `toResponsavel` | `authenticate(cpf, password)`, `GuardianRecord`, `records`, `toGuardian` |
| store `responsavelId`, `alunoRm`, `selectAluno` | `guardianId`, `studentRm`, `selectStudent` |
| `useSession()` → `{ responsavel, aluno }` | `{ guardian, student }` |
| `src/utils/agenda.ts` (`formatDayLabel`, `initialDay`) | `src/utils/schedule.ts` (mesmos nomes) |
| `src/utils/boletim.ts`: `boletimLabel`, `trimestreLabel`, `disciplinaLabel`, `formatNota`, `formatFaltas` | `src/utils/reportCard.ts`: `reportCardLabel`, `termLabel`, `subjectLabel`, `formatGrade`, `formatAbsences` |
| `src/screens/Aulas/`: `Aulas`, `AulaItem`, `SemAulas`, `useAgenda` | `src/screens/Schedule/`: `Schedule`, `LessonItem`, `EmptyDay`, `useSchedule` |
| `src/screens/Boletim/`: `Boletim`, `DisciplinaDetalhe`, `useBoletim` (`boletins`, `selectBoletim`) | `src/screens/ReportCard/`: `ReportCard`, `SubjectDetails`, `useReportCard` (`reportCards`, `selectReportCard`) |
| `src/screens/TrocaAluno/`: `TrocaAluno`, `AlunoCard` | `src/screens/StudentSwitch/`: `StudentSwitch`, `StudentCard` |
| rotas `TrocaAluno`; abas `Aulas`, `Boletim`; `renderAulasIcon`, `renderBoletimIcon` | `StudentSwitch`; `Schedule`, `ReportCard` (rótulos `AGENDA`/`BOLETIM` iguais); `renderScheduleIcon`, `renderReportCardIcon` |

Nomes locais não listados seguem a mesma regra (ex.: `aluno` → `student`, `responsavel` → `guardian`, `chosen` mantém).

## Global Constraints

- Comportamento, layout e textos idênticos: os testes existentes continuam passando só com renomeações (asserções de texto não mudam).
- `git mv` para arquivos/pastas; nenhum arquivo novo além dos renomeados.
- Commits Conventional Commits, tipo `refactor`, subject minúsculo, corpo 3–5 linhas, **sem `Co-Authored-By` ou atribuição**. Nunca adicionar `docs/superpowers/plans/` nem `ios/` aos commits.
- Não adicionar comentários.

## Review Focus

1. **Texto visível traduzido por engano** (`BOLETIM`, `Ano do boletim`, copy do Login) → continua em português. Coberto pelos testes de tela existentes.
2. **Campo do JSON renomeado por engano** (`primeiroNome` → `firstName`) → quebraria a leitura dos dados. Coberto pelos testes do repositório e das telas.
3. **Rota renomeada só de um lado** (navigate para `'TrocaAluno'`) → typecheck com `RootStackParamList` pega; e2e do `RootNavigator` cobre.
4. **Identificador em português esquecido** → verificação por grep na Task 4.
5. **Comentário que era diretiva de ferramenta removido** → lint/typecheck pegam.

---

## Fase 1: Refactor

### Task 1: Dados e sessão

**Files:** `src/data/types.ts`, `src/data/repository.ts` (+ teste), `src/store/useSessionStore.ts`, `src/store/useSession.ts` (+ testes), `src/utils/student.ts` (+ teste) e todos os consumidores (telas, Header, rotas, testes).

- [ ] Renomear tipos, funções e campos da store conforme o mapa, atualizando todos os usos.
- [ ] `yarn lint && yarn typecheck && CI=true yarn test` → PASS.
- [ ] Commit `refactor: use english names for data and session`

### Task 2: Utilitários

**Files:** `git mv src/utils/agenda.ts src/utils/schedule.ts`, `git mv src/utils/boletim.ts src/utils/reportCard.ts` (+ testes) e consumidores.

- [ ] Renomear arquivos e funções conforme o mapa.
- [ ] Verificação completa → PASS.
- [ ] Commit `refactor: use english names for schedule and report card helpers`

### Task 3: Telas e rotas

**Files:** `git mv` das pastas `Aulas` → `Schedule`, `Boletim` → `ReportCard`, `TrocaAluno` → `StudentSwitch` e dos arquivos internos; `src/routes/*`, `src/routes/types.ts`, testes.

- [ ] Renomear pastas, arquivos, componentes, hooks, rotas e funções de ícone conforme o mapa.
- [ ] Verificação completa → PASS.
- [ ] Commit `refactor: use english names for screens and routes`

### Task 4: Sem comentários e varredura final

- [ ] Remover comentários de `src/` (regras acima).
- [ ] Varredura — deve voltar vazia:
  ```bash
  grep -rnE "\b(Responsavel|Aluno|AgendaDia|Trimestre|Disciplina|TrocaAluno|AulaItem|SemAulas|DisciplinaDetalhe|useAgenda|useBoletim|getResponsavel|responsavelId|alunoRm|selectAluno|formatNota|formatFaltas)\b" src
  grep -rnE "^\s*//|/\*" src | grep -vE "eslint-disable|@ts-expect-error"
  ```
- [ ] Verificação completa → PASS.
- [ ] Commit `refactor: remove inline comments`

### Task 5: README

- [ ] Atualizar a seção **Estrutura** com os novos caminhos.
- [ ] `yarn lint && yarn typecheck && CI=true yarn test --coverage` → PASS.
- [ ] Commit `docs: update readme structure with english names`

- [ ] **Task: Phase Verification & Checkpoint (Refer to workflow.md)** — manual pelo usuário em iOS e Android: login, troca de aluno, agenda, boletim e sair funcionam como antes; textos iguais.

# Plan: Login, sessão, cabeçalho e troca de aluno

Origem e detalhes (medidas do Figma, interfaces, testes, comandos): [`docs/superpowers/plans/2026-10-25-login-session-header.md`](../../../docs/superpowers/plans/2026-10-25-login-session-header.md). Cada task abaixo corresponde à task de mesmo número lá. Seguir `conductor/workflow.md`.

## Phase 1: Dados e sessão

- [x] Task 1: Tipos e repositório [31c3499]
    - [x] Escrever testes falhando (CPF com/sem máscara, sem senha no retorno, credencial errada, `getResponsavel`)
    - [x] Implementar `src/data/types.ts` e `src/data/repository.ts`
    - [x] Confirmar PASS
    - [x] Commit `feat(data): add typed repository over embedded json` (inclui `src/data/responsaveis.json`)
- [x] Task 2: Formatadores de aluno [cfe65a2]
    - [x] Escrever testes falhando
    - [x] Implementar `src/utils/student.ts`
    - [x] Confirmar PASS
    - [x] Commit `feat(utils): add student display formatters`
- [x] Task 3: Store de sessão [f28a06f]
    - [x] Escrever testes falhando (signIn/selectAluno/signOut, persistência só de ids, sessão órfã)
    - [x] Implementar `useSessionStore`, `useSessionHydrated`, `useSession`
    - [x] Confirmar PASS
    - [x] Commit `feat(store): add persisted session with student selection`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) [checkpoint: f28a06f]
    - **Verificação:** só automatizada (82 testes); sem tela nesta fase.

## Phase 2: Login

- [x] Task 4: Ícone do `TextButton` depois do texto [a9cbe27]
    - [x] Escrever teste falhando (ordem texto → ícone)
    - [x] Implementar
    - [x] Confirmar PASS
    - [x] Commit `fix(components): place text button icon after the label`
- [x] Task 5: `useLoginForm` [a50a781]
    - [x] Escrever testes falhando (máscara, habilitação, sucesso, erro que limpa, uma autenticação por vez)
    - [x] Implementar
    - [x] Confirmar PASS
    - [x] Commit `feat(login): add login form state hook`
- [x] Task 6: Tela de Login e navegação por sessão [912b98a]
    - [x] Escrever testes falhando (Login, RootNavigator sem/com sessão sem piscar o Login, App)
    - [x] Implementar `Login.tsx` e `RootNavigator.tsx`; remover botão temporário
    - [x] Confirmar PASS
    - [x] Commit `feat(login): add login screen and session-based navigation`
    - **Desvio:** `TextField` alterado (achado na revisão do design): rótulo centralizado (`textAlign="center"`, com teste) e texto de erro com `marginTop: 32` e centralizado, para bater com o Figma (erro 32 abaixo do sublinhado).
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) [checkpoint: d1355a0]
    - **Verificação manual:** iOS e Android — estados do Login, máscara, botão, carregando, erro com shake, teclado, login válido e reabertura em Aulas. Confirmado pelo usuário.
    - **Desvio (verificação no aparelho) [d3f7f3f]:** `useSessionHydrated` tinha corrida (reidratação terminando antes da inscrição deixava tela branca no Android); passou a usar `useSyncExternalStore`.
    - **Desvio (verificação no aparelho) [d1355a0]:** "Next" do CPF não fazia nada; `TextField` repassa `ref` e o Login foca a SENHA.

## Phase 3: Cabeçalho e troca de aluno

- [x] Task 7: Cabeçalho [35486be]
    - [x] Escrever testes falhando (saudação/aluno/linha, TROCAR PERFIL condicional, SAIR, Aulas/Boletim com cabeçalho)
    - [x] Implementar `Header`, tokens `greetingName` e `xl2`; usar em Aulas e Boletim; remover botão temporário de Aulas
    - [x] Confirmar PASS
    - [x] Commit `feat(header): add authenticated header with student info and actions`
- [ ] Task 8: Troca de aluno
    - [ ] Escrever testes falhando (lista, seleção + volta, FECHAR, ponta a ponta)
    - [ ] Implementar `TrocaAluno.tsx`
    - [ ] Confirmar PASS
    - [ ] Commit `feat(student-switch): add student selection screen`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 4: Documentação

- [ ] Task 9: README
    - [ ] Atualizar Estrutura, Status e Acesso de demonstração
    - [ ] `yarn lint && yarn typecheck && CI=true yarn test --coverage`
    - [ ] Commit `docs: update readme with login and session`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md) — track concluída

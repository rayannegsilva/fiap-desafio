# Spec: Login, sessão, cabeçalho e troca de aluno

**Tipo:** Feature
**Origem:** [`docs/superpowers/plans/2026-10-25-login-session-header.md`](../../../docs/superpowers/plans/2026-10-25-login-session-header.md) — medidas do Figma, interfaces, testes e comandos de cada task estão lá.

## Visão geral

O responsável entra com CPF e senha, a sessão fica salva (o app reabre direto em Aulas), Aulas e Boletim ganham o cabeçalho do design e a troca de aluno funciona. Aulas e Boletim continuam com conteúdo placeholder abaixo do cabeçalho.

## Requisitos funcionais

1. **Dados:** `src/data/` com tipos e repositório sobre `responsaveis.json` (passa a ser versionado); `authenticate(cpf, senha)` assíncrona (600 ms), compara só os dígitos do CPF e nunca devolve a senha; `getResponsavel(id)`.
2. **Formatadores:** primeiro nome e nome completo em caixa alta, linha `{TURMA} - RM {RM} - {Período}`.
3. **Sessão:** store Zustand persistida só com `responsavelId` e `alunoRm`; `signIn`, `selectAluno`, `signOut`; `useSession()` resolve os dados e limpa sessão órfã; `useSessionHydrated()`.
4. **TextButton:** ícone passa para depois do texto (Figma).
5. **Formulário de login:** `useLoginForm` — máscara de CPF, botão habilitado com 11 dígitos + senha, carregando, erro genérico `Usuário ou senha inválida. Pode tentar novamente?` que some ao editar, uma autenticação por vez; responsável sem alunos → `Nenhum aluno vinculado a este responsável.` (**texto fora do design**).
6. **Tela de Login:** logo, CPF (teclado numérico), SENHA (oculta), erro com shake na SENHA, FAZER LOGIN colado na base acima do teclado; remove o botão temporário.
7. **Navegação por sessão:** `RootNavigator` mostra `Login` sem sessão e `Main` + `TrocaAluno` com sessão; nada é renderizado antes de reidratar.
8. **Cabeçalho:** barra de ações (logo; TROCAR PERFIL só com mais de um aluno; SAIR com ícone depois do texto), "Olá, **NOME**", nome do aluno e linha de turma/RM/período; SAIR encerra a sessão. Novos tokens `greetingName` e `xl2: 36`. Remove o botão temporário de Aulas.
9. **Troca de aluno:** FECHAR + X, título, um card por aluno (nome completo + linha), aluno atual com borda `accent`; tocar seleciona e volta.
10. **README:** estrutura, status e acesso de demonstração.

## Requisitos não funcionais

- Senha e CPF nunca persistidos nem logados.
- Só tokens do tema; textos exatos do design; acessibilidade (roles, labels, estados).
- Um commit por task, Conventional Commits, sem linha de atribuição; cobertura ≥ 80%.

## Critérios de aceite

1. CPF `969.294.560-04` / senha `123456` → Aulas com "Olá, GUSTAVO", "RAFAEL", "7EF - RM 12567 - Matutino", TROCAR PERFIL e SAIR.
2. Credencial errada → mensagem genérica + shake; editar limpa; botão desabilitado até CPF completo e senha; indicador ao carregar.
3. Reabrir com sessão → Aulas sem passar pelo Login.
4. TROCAR PERFIL → Rafael (borda) e Joana; escolher Joana → cabeçalho atualizado; FECHAR volta sem trocar.
5. Responsável `50879567007` / `987654` (um aluno) → sem TROCAR PERFIL.
6. SAIR → Login; reabrir abre no Login.
7. AsyncStorage sem senha/CPF.
8. Botões temporários removidos; lint, typecheck e testes com cobertura passam.

## Fora de escopo

- Conteúdo real de Aulas e Boletim; botão de tema; splash; recuperação de senha; backend.

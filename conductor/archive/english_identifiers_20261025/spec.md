# Spec: Identificadores em inglês e código sem comentários

**Tipo:** Refactor
**Origem:** [`docs/superpowers/plans/2026-10-25-english-identifiers.md`](../../../docs/superpowers/plans/2026-10-25-english-identifiers.md) — regras, mapa de nomes e comandos de cada task estão lá.

## Visão geral

Padronizar o código em inglês (arquivos, pastas, telas, rotas, componentes, funções, hooks, tipos, variáveis) e remover os comentários de `src/`, sem mudar comportamento nem textos da interface.

**Pré-requisito:** track Boletim arquivada.

## Requisitos

1. JSON (`src/data/responsaveis.json`) e campos dos tipos que o espelham ficam como estão; sem camada de tradução.
2. Textos visíveis e de leitor de tela continuam em português.
3. Demais identificadores em inglês conforme o mapa do plano (`Guardian`, `Student`, `Schedule`, `ReportCard`, `StudentSwitch`, `guardianId`, `studentRm`...).
4. Arquivos/pastas renomeados com `git mv`.
5. Sem comentários em `src/`, exceto diretivas de ferramenta.
6. Sessão salva com chaves novas; logout único aceito, sem migração.

## Critérios de aceite

1. Varreduras da Task 4 vazias.
2. Lint, typecheck e testes com cobertura passam sem mudar asserções de texto.
3. App funciona igual em iOS e Android (login, troca de aluno, agenda, boletim, sair).
4. README com a estrutura nova.

## Fora de escopo

- Renomear chaves do JSON; traduzir textos da interface; mudanças de comportamento ou layout.

# ADR 0001 — Figma prevalece sobre o texto dos requisitos

- **Status:** aceito
- **Data:** 2026-10-25

## Contexto

Os requisitos dizem que as telas autenticadas têm cabeçalho e rodapé. O Figma desenha a tela de troca de aluno sem cabeçalho e sem rodapé, com só o botão FECHAR, o título e os cards (página "Mudança de Aluno", node `1:4`). Os mesmos requisitos pedem fidelidade ao Figma.

## Decisão

Quando o texto dos requisitos e o Figma divergem em layout ou conteúdo de uma tela, o Figma prevalece. A troca de aluno fica sem cabeçalho e sem rodapé, como no design.

## Consequências

- A troca de aluno é uma tela própria (`StudentSwitch`), aberta de baixo para cima, fora do rodapé de abas.
- Divergências futuras entre os requisitos e o Figma seguem esta regra e são registradas na spec da track correspondente.
- Elementos que não existem no Figma (ex.: o modal de confirmação de saída) só entram com decisão explícita registrada em `conductor/product-guidelines.md`.

# Spec: Boletim

**Tipo:** Feature
**Origem:** [`docs/superpowers/plans/2026-10-25-boletim.md`](../../../docs/superpowers/plans/2026-10-25-boletim.md) — medidas do Figma, interfaces, testes e comandos de cada task estão lá.

## Visão geral

A aba BOLETIM mostra o boletim do aluno por ano, com trimestres e disciplinas expansíveis (nota e faltas), seguindo o Figma (página Boletim, frames `3:317`, `3:1054`, `3:389`, `3:549`).

## Requisitos funcionais

1. **Formatadores:** nota como nos dados com vírgula decimal (`9,5`, `8`, `10`), faltas inteiras, `null` → `-`; `{TURMA} - {ANO}`; `{n}º TRIMESTRE`; disciplina em caixa alta.
2. **useBoletim:** anos em ordem decrescente, ano mais recente por padrão, troca de ano; trocar de aluno volta ao ano mais recente.
3. **Dropdown:** com uma opção só vira caixa estática (sem chevron, não abre).
4. **Detalhe da disciplina:** `Nota:` e `Faltas:` com valor.
5. **Tela:** `Header` fixo; título BOLETIM, dropdown de ano e cards de trimestre (`Collapsible` card) com disciplinas (`Collapsible` row) num `ScrollView`; tudo começa fechado e abre de forma independente; trocar ano/aluno fecha tudo.
6. **Animação:** cards entram com `FadeInDown` em stagger (`motion.stagger`).

## Requisitos não funcionais

- Só tokens do tema/`motion`; espaçamentos do Figma arredondados para inteiros; valores sem token como constantes nomeadas.
- Textos exatamente do design: `BOLETIM`, `{n}º TRIMESTRE`, `Nota:`, `Faltas:`, `-`.

## Critérios de aceite

1. Aba BOLETIM mostra cabeçalho, BOLETIM, `7EF - 2025` (Rafael) e os três trimestres fechados.
2. Abrir trimestre lista disciplinas em caixa alta; abrir disciplina mostra nota e faltas.
3. 2º/3º trimestre de 2025 mostram `-`.
4. Rafael troca para `6EF - 2024`; tudo fecha.
5. Joana/Bianca: caixa de ano estática.
6. Trocar de aluno volta ao ano mais recente e fecha tudo.
7. Lint, typecheck e testes com cobertura passam.

## Fora de escopo

- Botão de tema; logo em melhor resolução; média anual ou dados fora do JSON.

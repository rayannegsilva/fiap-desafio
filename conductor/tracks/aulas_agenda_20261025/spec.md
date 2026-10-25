# Spec: Agenda de aulas

**Tipo:** Feature
**Origem:** [`docs/superpowers/plans/2026-10-25-aulas-agenda.md`](../../../docs/superpowers/plans/2026-10-25-aulas-agenda.md) — medidas do Figma, interfaces, testes e comandos de cada task estão lá.

## Visão geral

A aba AGENDA mostra as aulas do aluno selecionado num dia da semana, com dropdown para trocar de dia e estado "Sem aulas neste dia", seguindo o Figma (página Aulas, frames `2:88`, `2:48`, `2:24`).

## Requisitos funcionais

1. **Rótulo do dia:** `{d} de {mês}, {dia-da-semana}` (ex.: `16 de março, domingo`), montado à mão a partir de `YYYY-MM-DD` com `Date.UTC`/`getUTCDay` (sem `Intl`, imune a fuso).
2. **Dia inicial:** dia da agenda com o mesmo dia da semana de hoje; sem correspondência → primeiro dia; agenda vazia → nenhum.
3. **useAgenda:** dias do aluno, dia selecionado (estado guarda só a data) e `selectDay`; trocar de aluno mantém a data.
4. **Item de aula:** marcador 6×6 com contorno 1 `marker`, horário (`caption`), disciplina (`bodyStrong`); itens a cada 59.
5. **Vazio:** ilustração `no-classes.png` (decorativa) + "Sem aulas neste dia" (`emptyState`).
6. **Tela:** `Header`, título AGENDA, `Dropdown` dos 7 dias, lista rolável (cabeçalho e dropdown fixos).
7. **Animação:** itens entram com `FadeInDown` (300ms, stagger 40ms via `motion.stagger`) ao exibir/trocar de dia; vazio com `FadeIn`; reduzir movimento respeitado.

## Requisitos não funcionais

- Só tokens do tema/`motion`; valores do Figma sem token como constantes nomeadas.
- Textos exatamente do design: `AGENDA`, `Sem aulas neste dia`.

## Critérios de aceite

1. Aba AGENDA mostra cabeçalho, AGENDA, dropdown com o dia por extenso e as aulas do dia na ordem do JSON.
2. Abre no dia da semana de hoje dentro da semana dos dados.
3. Dropdown lista os 7 dias; escolher troca a lista com animação.
4. Domingo/sábado mostram ilustração + "Sem aulas neste dia".
5. Trocar de aluno mantém o dia e mostra as aulas do novo aluno.
6. Lista rola em tela pequena sem mover cabeçalho e dropdown.
7. Lint, typecheck e testes com cobertura passam.

## Fora de escopo

- Boletim; botão de tema; logo em melhor resolução; swipe entre dias.

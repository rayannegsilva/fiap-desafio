# Spec: Componentes base

**Tipo:** Feature
**Origem:** [`docs/superpowers/plans/2026-10-24-base-components.md`](../../../docs/superpowers/plans/2026-10-24-base-components.md) — código, testes e comandos de cada task estão lá.

## Visão geral

Camada `src/components/` com os componentes que as telas vão usar, um por comportamento (não por tela): `Text`, `PrimaryButton`, `TextButton`, `TextField`, `Collapsible`, `Dropdown`. Mais `usePressScale` (microinteração de toque), `motion.ts` (constantes de animação) e `formatCpf` (máscara). Componentes não conhecem dados do domínio: recebem valores e callbacks.

## Requisitos funcionais

1. **Text:** sobre o `Text` do Restyle; `variant` padrão `body`, `maxFontSizeMultiplier` padrão 1.3; aceita props nativos. As 4 telas passam a usá-lo. Variantes continuam no tema.
2. **motion + usePressScale:** `src/theme/motion.ts` com escala 0.96, opacidade 0.7, spring e durações (150/300 ms). Hook escala ao pressionar; com "reduzir movimento", troca escala por opacidade.
3. **formatCpf:** `src/utils/`; só dígitos, até 11, máscara `000.000.000-00` progressiva.
4. **PrimaryButton:** largura total, 60 de altura, fundo `accent`; desabilitado (label `textDisabled`) e carregando (spinner, sem label) ignoram toques; estado acessível `disabled`/`busy`.
5. **TextButton:** label `caption` (ou `cardTitle` para FECHAR), ícone opcional antes do texto na mesma cor, `hitSlop` 12.
6. **TextField:** rótulo acima, valor `inputValue`, sublinhado `lineIdle`/`lineActive`, erro `error` abaixo com shake (sem shake em "reduzir movimento"); máscara fica fora. `renderWithProviders` passa a usar `wrapper`.
7. **Collapsible:** variantes `card` (trimestre) e `row` (disciplina); cabeçalho com chevron girando; conteúdo renderizado ao abrir, empurra o que vem abaixo; aninhável; estado `expanded` acessível.
8. **Dropdown:** genérico (`options`, `selected`, `onSelect`, `getLabel`, `getKey`); caixa `surface` 45 de altura; painel de opções **flutua** por cima do conteúdo; selecionar chama `onSelect` e fecha; tocar na caixa alterna.
9. **README:** estrutura e status atualizados.

## Requisitos não funcionais

- Só tokens do tema e de `motion`; nada de valores fixos de cor/espaçamento/fonte.
- Reanimated para animações; respeitar "reduzir movimento".
- Toque ≥ 44×44; roles, labels e estados acessíveis.
- Um componente por pasta com teste ao lado; cobertura ≥ 80%.
- Commits Conventional Commits, corpo 3–5 linhas, sem linha de atribuição.

## Critérios de aceite

1. Telas e componentes usam `Text` de `src/components/Text`.
2. Cada componente tem teste de comportamento e acessibilidade.
3. "Reduzir movimento" ligado: sem escala no toque e sem shake no erro.
4. `Dropdown` flutua sobre um `Collapsible` sem deslocá-lo; título longo quebra mantendo o chevron visível (verificação manual).
5. `yarn lint`, `yarn typecheck`, `CI=true yarn test --coverage` passam.

## Fora de escopo

- Telas reais (Login, Aulas, Boletim, Troca de aluno) e dados (`src/data/`).
- Fechar o `Dropdown` ao tocar fora dele.
- Firebase/backend.

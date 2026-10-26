# Spec: Animações de entrada e saída

**Tipo:** Feature
**Origem:** [`docs/superpowers/plans/2026-10-26-animacoes.md`](../../../docs/superpowers/plans/2026-10-26-animacoes.md) — regras de movimento, mapa de momentos, interfaces e testes estão lá.

## Visão geral

Entrada e saída suaves e discretas em todos os momentos do app, corrigindo o fechamento brusco do `Collapsible`.

## Requisitos funcionais

1. Tokens `motion.duration.exit` (200ms) e `motion.easing.enter/exit`.
2. Fade entre Login e Agenda (nos dois sentidos) e entre abas.
3. `Collapsible` fecha com a mesma suavidade de abrir, conteúdo esmaecendo com a altura.
4. Dropdown com fade + 8pt de deslocamento.
5. Modal de saída anima a saída antes de desmontar; `signOut` após a animação.
6. Listas antigas saem com fade ao trocar dia/ano/aluno; cabeçalho com fade cruzado ao trocar aluno; erro e carregando do login com fade.

## Requisitos não funcionais

- Só opacidade, deslocamento curto e escala mínima; sem quique.
- Reduzir movimento respeitado; interação não bloqueada.
- Sem comentários no código; só tokens do tema/`motion`.

## Critérios de aceite

1. Nenhum elemento some ou aparece seco nos momentos do mapa.
2. Collapsible e modal sem saltos ao abrir/fechar rápido; listas sem fantasmas ao trocar rápido.
3. Reduzir movimento: só fade ou nada.
4. Lint, typecheck e testes com cobertura passam.

## Fora de escopo

- Transições compartilhadas entre telas (shared element); haptics; novas telas.

# Spec: Tema do sistema e splash animada

**Tipo:** Feature
**Origem:** [`docs/superpowers/plans/2026-10-25-splash.md`](../../../docs/superpowers/plans/2026-10-25-splash.md) — decisões, tempos, interfaces e testes de cada task estão lá.

## Visão geral

O tema passa a seguir o modo do sistema, ao vivo. Ao abrir o app, a splash nativa mostra só o fundo do modo do sistema; por cima, o FIAP rosa (vetor do Figma, página Capa) se desenha traço a traço e entrega para a tela de destino.

## Requisitos funcionais

1. **Tema:** modo `system` por padrão (`useColorScheme`, reage a trocas manuais e automáticas); `light`/`dark` manual sobrepõe; status bar acompanha.
2. **Splash nativa:** só o fundo do modo do sistema (preto/branco), sem ícone nem textos, iOS e Android (12+ incluso).
3. **Logo vetorial:** FIAP em linhas centrais, desenhado letra a letra (F → I → A → P) em rosa `brand`.
4. **Saída → Login:** logo viaja até a posição da logo do Login, rosa → turquesa, e passa para o PNG com o selo SCHOOL. Plano B: fade.
5. **Saída → Aulas:** fade.
6. **Espera:** só sai quando o desenho terminou e a sessão reidratou; bloqueia toques enquanto visível.
7. **Reduzir movimento:** só fades.

## Requisitos não funcionais

- Total ≤ 2 s; não atrasa reidratação nem navegação.
- Tempos em `motion.splash`; só `transform`, `opacity`, `strokeDashoffset` e cor animados.
- Sem comentários no código; identificadores em inglês.

## Critérios de aceite

1. Abrir frio em claro e escuro: sem piscar entre branco e preto, sem ícone.
2. Trocar o modo do sistema com o app aberto troca o tema na hora.
3. Desenho fluido; sem sessão a logo chega sem pulo sobre a do Login; com sessão vai para Aulas com fade.
4. Reduzir movimento respeitado; lint, typecheck e testes com cobertura passam.
5. Telas revisadas no tema claro.

## Fora de escopo

- Botão de tema no cabeçalho; ícone do app; troca da logo do Login por SVG.

# Product Guidelines

## Conteúdo e textos
Todo texto exibido (títulos, labels, mensagens) vem do design. Não inventar copy; divergências ou textos faltando são registrados na spec da track.

## Identidade visual
- Paleta, tipografia, ícones e ilustrações: **a definir (design)**.
- Toda cor, espaçamento, raio e fonte vem do tema Restyle — nunca valores fixos em componentes.
- Todo token existe nas variantes claro e escuro.

## Acessibilidade
- Elementos interativos com `accessibilityRole` e `accessibilityLabel`; ícones sem texto sempre rotulados.
- Área de toque mínima de 44×44pt (`hitSlop` quando o visual for menor).
- Contraste mínimo WCAG AA (4.5:1 para texto, 3:1 para elementos grandes) nos dois temas.
- Suporte a fonte dinâmica do sistema sem quebrar layout.
- Ordem de foco lógica para leitores de tela (VoiceOver/TalkBack).
- Informação nunca transmitida só por cor ou só por animação.

## Animações
- **Propósito antes de enfeite:** toda animação comunica algo — origem/destino de navegação, mudança de estado, hierarquia ou feedback.
- **Duração:** microinterações 100–200ms; transições de tela e entradas de conteúdo 250–400ms; splash é exceção, mas curta (≤ 2s) e não atrasa o app pronto.
- **Física:** springs para elementos manipuláveis/gestos; timing com easing (ease-out na entrada, ease-in na saída) para transições.
- **Performance:** animar apenas `transform` e `opacity` sempre que possível; rodar na UI thread (Reanimated worklets); meta de 60 fps.
- **Nunca bloquear:** interação permitida durante ou interrompendo a animação.
- **Reduzir movimento:** respeitar a preferência do sistema — substituir deslocamentos/escalas por fade simples ou nenhuma animação.
- **Entrada de telas:** conteúdo entra em sequência leve (stagger 30–60ms) em vez de tudo de uma vez.

## Microinterações
- **Toque:** feedback imediato em todo elemento pressionável (escala ~0.96 ou opacidade) com spring de retorno.
- **Estados:** loading, vazio, erro e sucesso sempre têm representação visual; transições entre eles animadas.
- **Formulários:** foco, erro e validação com feedback visual sutil (ex.: shake curto em erro).
- **Troca de tema:** transição suave entre claro/escuro.
- **Háptico:** apenas em ações significativas (confirmação, erro), se adotado.

## Consistência
- Componentes reutilizáveis antes de estilos ad hoc.
- Mesma ação → mesma animação em todo o app.

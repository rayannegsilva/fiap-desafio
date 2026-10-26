# Product Guidelines

## Conteúdo e textos

Todo texto exibido (títulos, labels, mensagens) vem do design. Não inventar copy; divergências ou textos faltando são registrados na spec da track.

## Identidade visual

Fonte da verdade: o Figma do produto. Referências exportadas em [`docs/design/`](../docs/design/).

- Toda cor, espaçamento, raio e fonte vem do tema Restyle — nunca valores fixos em componentes.
- O design de referência é **escuro**: fundo preto, superfícies em cinza, destaque turquesa e rosa só na marca.
- Botão de tema (claro/escuro) na barra de ações do cabeçalho, junto de TROCAR PERFIL e SAIR — único elemento fora do Figma.

### Cores

O tema segue o modo do sistema (claro ou escuro), inclusive trocas com o app aberto; a escolha manual (`light`/`dark`), quando existir, sobrepõe o sistema e é persistida. O **escuro** é o do Figma; o **claro** é derivado e mantém as mesmas chaves. A status bar acompanha o tema.

| Token           | Escuro (Figma) | Claro (derivado) | Uso                                                                                      |
| --------------- | -------------- | ---------------- | ---------------------------------------------------------------------------------------- |
| `background`    | `#000000`      | `#FFFFFF`        | Fundo das telas e barra de ações do cabeçalho                                            |
| `surface`       | `#262626`      | `#F2F2F2`        | Dropdowns (dia, ano), lista aberta do dropdown, rodapé de abas                           |
| `surfaceRaised` | `#4D4D4D`      | `#E0E0E0`        | Cards de trimestre e de aluno                                                            |
| `accent`        | `#29F4D5`      | `#29F4D5`        | Preenchimentos: botão principal, borda do aluno selecionado                              |
| `accentText`    | `#29F4D5`      | `#006B5D`        | Texto/ícone em destaque: títulos de seção, trimestres, aba ativa, chevrons, erro, FECHAR |
| `onAccent`      | `#000000`      | `#000000`        | Texto sobre `accent`                                                                     |
| `brand`         | `#ED145B`      | `#ED145B`        | Só no logo (selo "SCHOOL")                                                               |
| `textPrimary`   | `#FFFFFF`      | `#111111`        | Texto padrão, ícones de aba inativa                                                      |
| `textDisabled`  | `#777777`      | `#777777`        | Texto do botão desabilitado                                                              |
| `lineIdle`      | `#525252`      | `#BDBDBD`        | Sublinhado de campo vazio                                                                |
| `lineActive`    | `#FFFFFF`      | `#111111`        | Sublinhado de campo preenchido                                                           |
| `marker`        | `#CCCCCC`      | `#757575`        | Contorno do marcador de aula                                                             |

Mensagem de erro usa `accentText`, não vermelho (decisão do design). `#29F4D5` sobre branco não passa AA, por isso o claro separa `accent` (preenchimento) de `accentText`.

### Tipografia

- Família: **Montserrat** — Regular, Medium, SemiBold, Bold — embarcada no app (uma `fontFamily` por peso).
- Altura de linha "normal" do Figma ≈ 1,22 × tamanho (valores abaixo).
- Valores exatos do Figma (modo Dev):

| Variante        | Tamanho/linha | Peso                   | Cor                                | Uso                                              |
| --------------- | ------------- | ---------------------- | ---------------------------------- | ------------------------------------------------ |
| `inputValue`    | 32/39         | Regular                | `textPrimary`                      | Valor de CPF/senha no login                      |
| `greeting`      | 24/29         | Regular (nome em Bold) | `textPrimary`                      | "Olá, **NOME**"                                  |
| `screenTitle`   | 24/29         | Regular                | `textPrimary`                      | Título da troca de aluno                         |
| `sectionTitle`  | 20/24         | Bold                   | `accentText`                       | AGENDA, BOLETIM                                  |
| `button`        | 20/24         | Medium                 | `onAccent`                         | FAZER LOGIN                                      |
| `label`         | 20/24         | Regular                | `textPrimary`                      | CPF, SENHA                                       |
| `emptyState`    | 20/24         | Regular                | `textPrimary`                      | Sem aulas neste dia                              |
| `body`          | 16/20         | Regular                | `textPrimary`                      | Linha "TURMA - RM - Período", dropdowns e opções |
| `bodyMedium`    | 16/20         | Medium                 | `textPrimary`                      | Nome do aluno (cabeçalho e cards de aluno)       |
| `bodyStrong`    | 16/20         | SemiBold               | `textPrimary`                      | Disciplina na lista de aulas                     |
| `error`         | 16/20         | Medium                 | `accentText`                       | Mensagem de erro do login                        |
| `cardTitle`     | 16/20         | Bold                   | `accentText`                       | Trimestres, FECHAR                               |
| `caption`       | 12/15         | Regular                | `textPrimary`                      | Horário da aula, TROCAR PERFIL, SAIR             |
| `captionMedium` | 12/15         | Medium                 | `textPrimary`                      | Disciplina, "Nota:" e "Faltas:" no boletim       |
| `tab`           | 10/12         | Bold                   | `textPrimary` / `accentText` ativa | Rótulos do rodapé                                |

### Layout

- Base: tela de 414 pt de largura; layouts fluidos (nada de largura fixa), respeitando safe area.
- Margens laterais: 16 (cards/dropdowns), 24–28 (listas), 48 (campos do login).
- Raio: 8 em dropdowns e cards. Dropdown fechado: 45 de altura. Cards de trimestre e de aluno: 90 de altura. Botão de login: 60. Rodapé: 64. Barra de ações: 48.
- Cabeçalho (todas as telas autenticadas): barra de ações (logo pequeno à esquerda; TROCAR PERFIL e SAIR à direita), "Olá, NOME", nome do aluno, linha "TURMA - RM 00000 - Período". Tudo centralizado.
- Rodapé: duas abas (AGENDA, BOLETIM), ícone 24 + rótulo, fundo `surface`, aba ativa em `accentText`.

### Componentes e estados

- **Login:** logo grande; campos centralizados com rótulo acima e sublinhado; botão de largura total colado na base.
  - Botão desabilitado (fundo `accent`, texto `textDisabled`) até CPF e senha preenchidos.
  - Carregando: botão sem texto, com indicador.
  - Erro: mensagem centralizada abaixo da senha, em `accentText`.
- **Dropdown** (dia da agenda, ano do boletim): caixa `surface` com chevron; aberto, lista em `surface` abaixo, chevron para cima.
- **Aula:** marcador circular 6 pt só com contorno `marker` (1 pt) + horário (`caption`); disciplina (`bodyStrong`) abaixo. Itens a cada 59 pt.
- **Agenda vazia:** ilustração + "Sem aulas neste dia".
- **Boletim:** card por trimestre (`surfaceRaised`, título `accentText`, chevron) que expande a lista de disciplinas; cada disciplina expande "Nota:" e "Faltas:". Trimestre sem avaliação mostra "-".
- **Troca de aluno:** tela própria (sem cabeçalho nem rodapé), FECHAR + ícone X no topo, título "Escolha o perfil que você quer visualizar", cards `surfaceRaised` com nome completo e linha "TURMA - RM - Período"; aluno atual com borda `accent`.
- **Confirmação de saída** (fora do Figma, decisão de produto): modal no estilo do app — fundo escurecido, card `surfaceRaised`, título `sectionTitle` "Sair da conta?", mensagem "Você vai precisar entrar de novo com CPF e senha.", ações CANCELAR e SAIR; fecha ao tocar fora ou no voltar do Android.

### Assets

Exportados do Figma para `src/assets/`:

| Arquivo                  | Uso                                                                     | Observação                                                                                                      |
| ------------------------ | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `images/logo.png`        | Logo FIAP School: 306×49 no login, 100×16 na barra de ações             | Fonte do Figma é raster 250×40; no tamanho grande fica levemente ampliado. Trocar por SVG oficial se disponível |
| `images/no-classes.png`  | Ilustração da agenda vazia, 328×208 (recorte do topo da imagem 328×290) | Raster 1×                                                                                                       |
| `icons/calendar.svg`     | Aba AGENDA, 24                                                          | Cores fixas do Figma — trocar `fill` por `currentColor` ao implementar, para aba ativa/inativa e tema           |
| `icons/check-file.svg`   | Aba BOLETIM, 24                                                         | Idem                                                                                                            |
| `icons/chevron-down.svg` | Dropdowns, trimestres e disciplinas, 14; aberto = girado 180°           | Idem                                                                                                            |
| `icons/close.svg`        | FECHAR na troca de aluno, 24                                            | Idem                                                                                                            |
| `icons/logout.svg`       | SAIR, 10                                                                | Idem                                                                                                            |

## Textos do design

Usar exatamente: `CPF`, `SENHA`, `FAZER LOGIN`, `Usuário ou senha inválida. Pode tentar novamente?`, `TROCAR PERFIL`, `SAIR`, `Olá, {NOME}`, `AGENDA`, `BOLETIM`, `Sem aulas neste dia`, `{d} de {mês}, {dia-da-semana}` (ex.: `16 de março, domingo`), `{TURMA} - {ANO}` (ex.: `7EF - 2025`), `{n}º TRIMESTRE`, `Nota:`, `Faltas:`, `-`, `Escolha o perfil que você quer visualizar`, `FECHAR`. Fora do Figma (decisão de produto): `Sair da conta?`, `Você vai precisar entrar de novo com CPF e senha.`, `CANCELAR`.

Nomes de responsável e aluno no cabeçalho em caixa alta, só o primeiro nome. Notas com vírgula decimal (`9,5`).

## Acessibilidade

- Elementos interativos com `accessibilityRole` e `accessibilityLabel`; ícones sem texto sempre rotulados.
- Área de toque mínima de 44×44pt (`hitSlop` quando o visual for menor).
- Contraste mínimo WCAG AA (4.5:1 para texto, 3:1 para elementos grandes) nos dois temas.
- Suporte a fonte dinâmica do sistema sem quebrar layout.
- Ordem de foco lógica para leitores de tela (VoiceOver/TalkBack).
- Informação nunca transmitida só por cor ou só por animação.

## Animações

- **Propósito antes de enfeite:** toda animação comunica algo — origem/destino de navegação, mudança de estado, hierarquia ou feedback.
- **Duração:** microinterações 100–200ms; transições de tela e entradas de conteúdo 250–400ms; splash é exceção, até 2,7 s, validada em dispositivo, e não atrasa o app pronto.
- **Física:** springs para elementos manipuláveis/gestos; timing com easing (ease-out na entrada, ease-in na saída) para transições.
- **Performance:** animar apenas `transform` e `opacity` sempre que possível; rodar na UI thread (Reanimated worklets); meta de 60 fps.
- **Nunca bloquear:** interação permitida durante ou interrompendo a animação.
- **Reduzir movimento:** respeitar a preferência do sistema — substituir deslocamentos/escalas por fade simples ou nenhuma animação.
- **Entrada de telas:** conteúdo entra em sequência leve (stagger 30–60ms) em vez de tudo de uma vez.

## Microinterações

- **Toque:** feedback imediato em todo elemento pressionável (escala ~0.96 ou opacidade) com spring de retorno.
- **Estados:** loading, vazio, erro e sucesso sempre têm representação visual; transições entre eles animadas.
- **Formulários:** foco, erro e validação com feedback visual sutil (ex.: shake curto em erro).
- **Troca de tema:** transição suave entre escuro/claro.
- **Háptico:** apenas em ações significativas (confirmação, erro), se adotado.

## Dados e privacidade

- CPF sempre exibido e digitado com máscara.
- Senha nunca é persistida nem logada.
- Erro de login genérico, sem indicar qual campo errou.
- Nomes no cabeçalho usam só o primeiro nome.

## Consistência

- Componentes reutilizáveis antes de estilos ad hoc.
- Mesma ação → mesma animação em todo o app.

# Fiap School - Desafio Técnico Mobile

Aplicativo mobile desenvolvido para o desafio técnico da FIAP, permitindo que responsáveis acompanhem a rotina acadêmica de seus alunos, incluindo aulas, horários, notas e faltas.

Desenvolvido com React Native CLI, TypeScript e Restyle, com foco em qualidade de código, organização arquitetural, acessibilidade visual e experiência do usuário.

O desenvolvimento foi conduzido utilizando Spec-Driven Development (SDD), com apoio de inteligência artificial para planejamento, decomposição de tarefas e implementação orientada a testes (TDD).

## Demonstração

<table>
  <tr>
    <th width="50%">iOS</th>
    <th width="50%">Android</th>
  </tr>
  <tr>
    <td><video src="https://github.com/user-attachments/assets/fd0ba7ce-054d-417b-9234-e981ec3a7e42" controls muted width="100%"></video><
/td>
    <td><video src="https://github.com/user-attachments/assets/e626d752-cc85-40b9-b1df-807cf93967a9" controls muted width="100%"></video><
/td>
  </tr>
</table>

## Funcionalidades

- **Login** com CPF (máscara automática) e senha, erro genérico em credenciais inválidas e teclado que não cobre os campos.
- **Sessão persistida:** ao reabrir, o app vai direto para a agenda; sessão corrompida cai com segurança no login.
- **Cabeçalho** com saudação ao responsável, nome, turma, RM e período do aluno; **SAIR** encerra a sessão.
- **Troca de aluno** (TROCAR PERFIL) para responsáveis com mais de um aluno, com o aluno atual destacado.
- **Agenda:** aulas do dia (horário e disciplina), seleção entre os dias da semana e estado vazio para dias sem aula.
- **Boletim:** ano mais recente por padrão, troca de ano quando há histórico, trimestres e disciplinas expansíveis com nota e faltas (`-` quando ainda não avaliado).
- **Splash animada:** o logo FIAP é desenhado traço a traço e segue para a primeira tela.
- **Tema claro/escuro** acompanhando o sistema em tempo real.
- **Animações** com Reanimated (entrada em cascata, toque, expandir/recolher), respeitando a opção de reduzir movimento.
- **Acessibilidade:** rótulos para leitores de tela, áreas de toque de 44 pt e limite de fonte dinâmica.
- **Ícone do app** para Android (adaptativo e temático) e iOS 26 (Liquid Glass).

## Stack

Aqui está a lista da tecnologia utillizada no projeto:

- [React Native](https://reactnative.dev) 0.88 (React Native CLI)
- TypeScript
- [Restyle](https://github.com/Shopify/restyle): tema tipado, dark/light mode
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/) 4: animações
- [react-native-safe-area-context](https://github.com/AppAndFlow/react-native-safe-area-context)
- [react-native-svg](https://github.com/software-mansion/react-native-svg) + [svg-transformer](https://github.com/kristerkari/react-native-svg-transformer): ícones como componentes
- [React Navigation](https://reactnavigation.org) (native-stack + bottom-tabs) + react-native-screens
- [Zustand](https://zustand.docs.pmnd.rs) + [AsyncStorage](https://github.com/react-native-async-storage/async-storage): estado e persistência
- Montserrat (Regular/Medium/SemiBold/Bold) via [react-native-asset](https://github.com/unimonkiez/react-native-asset)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) + Jest: testes
- [Husky](https://typicode.github.io/husky/) + [commitlint](https://commitlint.js.org): hooks de qualidade nos commits


## Arquitetura e organização

O código é organizado por responsabilidades, separando telas, componentes reutilizáveis, navegação, estado, camada de dados e design system.

```
.
├── index.js                 # Entry point
├── src/
│   ├── App.tsx               # Raiz: safe area + tema + navegação
│   ├── assets/
│   │   ├── fonts/             # Montserrat
│   │   ├── icons/             # SVGs (fill="currentColor")
│   │   └── images/
│   ├── animations/
│   │   ├── usePressScale.ts      # Escala ao pressionar
│   │   └── useChevronRotation.ts # Rotação do chevron (abre/fecha)
│   ├── components/            # Uma pasta por componente (Componente.tsx + Componente.test.tsx)
│   │   ├── Text/
│   │   ├── PrimaryButton/
│   │   ├── TextButton/
│   │   ├── TextField/
│   │   ├── Collapsible/
│   │   ├── Dropdown/
│   │   ├── Header/            # Cabeçalho autenticado (aluno, troca e sair)
│   │   ├── FiapStrokeLogo/    # Logo FIAP desenhada traço a traço
│   │   ├── SplashOverlay/     # Splash animada até a primeira tela
│   │   └── StudentSummary/    # Saudação e aluno no topo das telas
│   ├── data/
│   │   ├── types.ts           # Tipos de responsável, aluno e agenda
│   │   ├── responsaveis.json  # Responsáveis e alunos (dados fictícios)
│   │   └── repository.ts      # authenticate e getGuardian
│   ├── hooks/
│   │   └── useKeyboardVisible.ts # Visibilidade do teclado
│   ├── routes/
│   │   ├── RootNavigator.tsx    # Stack: Login, Main, StudentSwitch
│   │   ├── MainTabNavigator.tsx # Abas: Schedule, ReportCard
│   │   └── types.ts             # Parâmetros de rota tipados
│   ├── screens/               # Uma pasta por tela (Tela.tsx + Tela.test.tsx)
│   │   ├── Login/             # Login: useLoginForm, loginLayout
│   │   ├── Schedule/          # Agenda do aluno: useSchedule, LessonItem, EmptyDay
│   │   ├── ReportCard/        # Boletim: useReportCard, SubjectDetails
│   │   └── StudentSwitch/
│   ├── store/
│   │   ├── useSessionStore.ts # Sessão persistida (Zustand + AsyncStorage)
│   │   ├── useSession.ts      # Responsável e aluno ativo da sessão
│   ├── theme/
│   │   ├── palette.ts         # Cores do design (escuro e claro)
│   │   ├── theme.ts           # Tema Restyle: cores, espaçamento, raio, tipografia
│   │   ├── motion.ts          # Constantes de animação
│   │   ├── restyle.ts         # Box e Text tipados
│   │   ├── useAppTheme.ts     # Tema ativo
│   │   └── AppProviders.tsx   # ThemeProvider + NavigationContainer
│   ├── test/
│   │   ├── renderWithProviders.tsx
│   │   └── libraries.test.tsx # smoke test de cada biblioteca
│   ├── types/
│   │   └── svg.d.ts
│   └── utils/
│       ├── schedule.ts        # Rótulo do dia e dia inicial da agenda
│       ├── reportCard.ts      # Rótulos e formatação de nota e faltas
│       ├── formatCpf.ts       # Máscara de CPF
│       └── student.ts         # Helpers de aluno
├── docs/adr/                # Decisões de arquitetura
├── android/                 # Projeto nativo Android
└── ios/                     # Projeto nativo iOS
```

**Principais decisões:**

- **Estado e sessão:** Zustand e AsyncStorage para manter a sessão e o aluno selecionado entre aberturas.
- **Dados desacoplados da interface:** `src/data/repository.ts` centraliza o acesso ao JSON do desafio.
- **Temas consistentes:** paleta e tokens centralizados em `src/theme/`, com suporte claro/escuro.
- **Registros arquiteturais:** decisões documentadas em [`docs/adr/`](docs/adr/).


## Fluxo de desenvolvimento: SDD, IA e TDD

O projeto foi desenvolvido com **Spec-Driven Development (SDD)**: as funcionalidades foram planejadas e especificadas antes da implementação. Os artefatos desse processo estão versionados nas pastas **[`docs/`](docs/)** e **[`conductor/`](conductor/)**, permitindo acompanhar as decisões e a execução.

### 1. Planejamento - Claude + OP Brainstorm

O Claude e o OP Brainstorm foram utilizados para analisar os requisitos, explorar abordagens e gerar planos com contexto, decisões, critérios de aceite e tarefas detalhadas.

Os planos estão em [`docs/superpowers/plans/`](docs/superpowers/plans/).

### 2. Especificações e tracks — Conductor

Os planos foram organizados em *tracks* com o [Conductor](https://github.com/gemini-cli-extensions/conductor), originalmente desenvolvido para o ecossistema Gemini e utilizado como skill no Claude.

As tracks concluídas ficam em [`conductor/archive/`](conductor/archive/) (as em andamento, em `conductor/tracks/`) e incluem:

- `spec.md`: escopo, requisitos e comportamentos esperados;
- `plan.md`: tarefas, checkpoints e referências aos commits de execução.

O contexto geral do projeto — produto, stack, diretrizes e workflow — está em [`conductor/`](conductor/), com entrada em [`conductor/index.md`](conductor/index.md).

### 3. Implementação — delegação de tarefas e TDD

Com as tarefas especificadas, a implementação foi delegada a um modelo de IA de menor capacidade, enquanto o Claude permaneceu responsável pelas etapas de análise e planejamento. A execução foi **orientada a TDD**, com testes para verificar os comportamentos esperados.

O fluxo adotado prevê **um commit por tarefa**, seguindo Conventional Commits. O `plan.md` registra os SHAs e checkpoints de cada fase, tornando as alterações rastreáveis.

A implementação também passou por execução de testes, revisão de código e validação manual das telas, fluxos e animações.

## Como rodar

O app roda em **Android no macOS, Windows e Linux**. O **iOS exige macOS** com Xcode.

Guia oficial do ambiente: [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment).

### macOS (iOS e Android)

**Pré-requisitos**

- Node.js **>= 22.11** e Yarn;
- Xcode (iOS), com Ruby, Bundler e CocoaPods;
- Android Studio com Android SDK e JDK 17 (Android).

**Instalação** (ou clone via SSH: `git clone git@github.com:rayannegsilva/fiap-desafio.git`)

```sh
git clone https://github.com/rayannegsilva/fiap-desafio.git
cd fiap-desafio

yarn install                                # dependências + hooks do Husky (via prepare)
bundle install                              # Ruby gems (CocoaPods)
cd ios && bundle exec pod install && cd ..  # dependências nativas do iOS
```

**Execução**

```sh
yarn start     # terminal 1: Metro
yarn ios       # terminal 2: simulador iOS
yarn android   # terminal 2: emulador ou aparelho Android
```

Para rodar num iPhone físico: `yarn ios --device "<nome do iPhone>"` (requer assinatura com um Apple ID no Xcode).

Após adicionar dependências nativas, rode de novo `cd ios && bundle exec pod install && cd ..`.

### Windows e Linux (Android)

**Pré-requisitos**

- Node.js **>= 22.11** e Yarn;
- Android Studio com Android SDK, um emulador (AVD) e JDK 17;
- variável de ambiente `ANDROID_HOME` apontando para o SDK e `platform-tools` no `PATH`.

**Instalação** (PowerShell no Windows, terminal no Linux)

```sh
git clone https://github.com/rayannegsilva/fiap-desafio.git
cd fiap-desafio
yarn install
```

**Execução**

```sh
yarn start     # terminal 1: Metro
yarn android   # terminal 2: emulador ou aparelho Android
```

Os passos de `bundle` e `pod install` são só do iOS e não se aplicam ao Windows nem ao Linux. No Linux, o emulador precisa de KVM habilitado para ter desempenho aceitável.

### Qualidade e testes

```sh
yarn lint         # ESLint
yarn typecheck    # TypeScript
yarn test         # Testes automatizados
```

Hooks do Git (Husky + commitlint):

- `commit-msg`: valida a mensagem ([Conventional Commits](https://www.conventionalcommits.org/) + tipo `conductor`);
- `pre-commit`: `yarn lint && yarn typecheck`;
- `pre-push`: `CI=true yarn test`.

## Dispositivos testados

| Plataforma | Dispositivo | Sistema |
| --- | --- | --- |
| iOS | iPhone 15 (aparelho físico) | iOS 26.6.2 |
| iOS | iPhone 15 (simulador, Xcode 27.1) | iOS 26.5 |
| iOS | iPhone 13 (simulador, Xcode 27.1) | iOS 26.5 |
| Android | Pixel 7 (emulador, 1080×2400) | Android 17 (API 37) |

## Acesso de demonstração

Os dados utilizados são **fictícios** e estão em `src/data/responsaveis.json`.

| Responsável | CPF | Senha | Alunos |
| --- | --- | --- | --- |
| Gustavo | `969.294.560-04` | `123456` | Rafael e Joana |
| Adelaide | `508.795.670-07` | `987654` | Bianca |

Use a conta de **Gustavo** para testar a troca de aluno e a conta de **Adelaide** para o fluxo com apenas um aluno vinculado.

## Sobre a desenvolvedora

Sou desenvolvedora de software, formada em Ciência da Computação pelo Instituto Federal do Ceará (IFCE) e mestre em Ciência da Computação pela UFERSA, com pesquisa na área de Engenharia de Software.

Tenho aproximadamente quatro anos de experiência profissional, atuando principalmente no desenvolvimento de aplicações mobile com React Native, além de experiência em desenvolvimento backend e frontend.

Ao longo da minha trajetória, tenho trabalhado com desenvolvimento e manutenção de aplicações em produção, participando de diferentes etapas do ciclo de vida do software, desde a implementação de funcionalidades até testes, manutenção e publicação.

Neste desafio, busquei aplicar não apenas meus conhecimentos em React Native, mas também práticas de engenharia de software, automação, testes e desenvolvimento assistido por inteligência artificial, com foco na qualidade técnica e na experiência do usuário.

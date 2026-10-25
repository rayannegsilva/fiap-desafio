# FiapTeste

App mobile (iOS e Android) para responsáveis acompanharem as aulas do dia e o boletim dos alunos. React Native CLI, TypeScript e Restyle, com tema escuro (e opção clara) e animações em todas as telas.

> Em construção. Funcionalidades são adicionadas por tracks (ver [Fluxo de desenvolvimento](#fluxo-de-desenvolvimento)).

## Stack

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

## Como rodar

### Requisitos

- Node >= 22.11
- Yarn
- Ruby + Bundler (CocoaPods)
- Xcode (iOS) e/ou Android Studio (Android)
- Ambiente configurado conforme [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment)

### Instalação

```sh
yarn               # instala deps e ativa os hooks (husky) via "prepare"
bundle install
cd ios && bundle exec pod install && cd ..
yarn react-native-asset   # linka as fontes (após clonar ou trocar fontes)
```

### Execução

```sh
yarn start     # Metro
yarn ios       # iOS
yarn android   # Android
```

### Qualidade

```sh
yarn lint
yarn typecheck
yarn test
```

Após instalar qualquer dependência nativa: `cd ios && bundle exec pod install`.

### Hooks (Husky + commitlint)

- `commit-msg`: valida a mensagem ([Conventional Commits](https://www.conventionalcommits.org/) + tipo `conductor`)
- `pre-commit`: `yarn lint && yarn typecheck`
- `pre-push`: `CI=true yarn test`

## Estrutura

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
│   │   └── useThemeStore.ts   # Tema claro/escuro (Zustand + AsyncStorage)
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

## Fluxo de desenvolvimento

Spec driven development: nenhuma funcionalidade começa pelo código.

1. **Plano** — brainstorming da funcionalidade resulta num plano com contexto, decisões, critérios de aceite e tasks detalhadas, em [`docs/superpowers/plans/`](docs/superpowers/plans/).
2. **Track** — o plano vira uma track no [Conductor](https://github.com/gemini-cli-extensions/conductor) em [`conductor/tracks/`](conductor/tracks/), com `spec.md` e `plan.md`. O contexto do projeto (produto, guidelines, stack, workflow) fica em [`conductor/`](conductor/index.md).
3. **Implementação** — TDD, um commit por task ([Conventional Commits](https://www.conventionalcommits.org/)); o `plan.md` registra o SHA de cada task e o checkpoint de cada fase.

Este README é atualizado ao concluir cada track.

## Status

| Funcionalidade | Status |
| -------------- | ------ |
| Projeto base (RN CLI + TypeScript + Restyle + Reanimated) | ✅ |
| Setup de dependências e ferramentas | ✅ |
| Tema (escuro/claro) e navegação (stack + abas Schedule/ReportCard) | ✅ |
| Componentes base (texto, botões, campo, collapsible, dropdown) | ✅ |
| Login, sessão, cabeçalho e troca de aluno | ✅ |
| Agenda de aulas | ✅ |
| Boletim | ✅ |
| Tema do sistema e splash animada | ✅ |

## Acesso de demonstração

Os dados são fictícios e ficam embutidos em `src/data/responsaveis.json`.

| CPF | Senha | Responsável | Alunos |
| --- | ----- | ----------- | ------ |
| `969.294.560-04` | `123456` | Gustavo | Rafael e Joana (permite trocar de perfil) |
| `508.795.670-07` | `987654` | Adelaide | Bianca |

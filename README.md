# FiapTeste

App mobile (iOS e Android) para responsáveis acompanharem as aulas do dia e o boletim dos alunos. React Native CLI, TypeScript e Restyle, com tema escuro (e opção clara) e animações em todas as telas.

> Em construção. Funcionalidades são adicionadas por tracks (ver [Fluxo de desenvolvimento](#fluxo-de-desenvolvimento)).

## Stack

- [React Native](https://reactnative.dev) 0.88 (React Native CLI)
- TypeScript
- [Restyle](https://github.com/Shopify/restyle): tema tipado, dark/light mode
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/) 4: animações
- [react-native-safe-area-context](https://github.com/AppAndFlow/react-native-safe-area-context)
- Jest: testes

## Como rodar

### Requisitos

- Node >= 22.11
- Yarn
- Ruby + Bundler (CocoaPods)
- Xcode (iOS) e/ou Android Studio (Android)
- Ambiente configurado conforme [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment)

### Instalação

```sh
yarn
bundle install
cd ios && bundle exec pod install && cd ..
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
yarn test
```

## Estrutura

```
.
├── App.tsx          # Componente raiz
├── index.js         # Entry point
├── __tests__/       # Testes
├── android/         # Projeto nativo Android
└── ios/             # Projeto nativo iOS
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

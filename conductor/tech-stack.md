# Tech Stack

## Core
- **Linguagem:** TypeScript
- **Framework:** React Native 0.88 (React Native CLI, sem Expo)
- **Gerenciador de pacotes:** Yarn
- **iOS deps:** CocoaPods via Bundler

## UI e experiência
- **Design system / tema:** @shopify/restyle — tokens tipados, tema claro/escuro
- **Animações:** react-native-reanimated 4 + react-native-worklets
- **Splash animada:** lottie-react-native *(planejado)*
- **Layout seguro:** react-native-safe-area-context

## Arquitetura
- **Navegação:** React Navigation — native stack *(planejado)*
- **Estado global:** Zustand *(planejado)*

## Testes
- **Runner:** Jest (`@react-native/jest-preset`)
- **Unitários:** funções puras, hooks e stores Zustand isolados.
- **Integração:** React Native Testing Library *(planejado)* — telas renderizadas com tema, navegação e store reais, validando fluxo do usuário (renderiza → interage → verifica resultado).
- **Fora de escopo:** testes E2E (Detox/Maestro).

## Qualidade de código
- **Lint:** ESLint (`@react-native`)
- **Formatação:** Prettier
- **Commits:** Conventional Commits + commitlint *(planejado)*
- **Git hooks:** Husky — lint, typecheck e testes antes de commit/push *(planejado)*

## Fora de escopo
- Backend e banco de dados próprios (salvo se o escopo funcional exigir).

# Tech Stack

## Core
- **Linguagem:** TypeScript
- **Framework:** React Native 0.88 (React Native CLI, sem Expo)
- **Gerenciador de pacotes:** Yarn
- **iOS deps:** CocoaPods via Bundler

## UI e experiência
- **Design system / tema:** @shopify/restyle — tokens tipados; escuro (padrão, do design) e claro derivado, preferência persistida
- **Fonte:** Montserrat (Google Fonts), linkada com `react-native-asset`
- **Ícones:** SVGs do design via `react-native-svg` + `react-native-svg-transformer` (`fill="currentColor"`)
- **Animações:** react-native-reanimated 4 + react-native-worklets
- **Layout seguro:** react-native-safe-area-context
- **Android 15+:** tema `AppTheme` em `android/app/src/main/res/values-v35/styles.xml` desliga `useBoundsForWidth` (bug de quebra de linha do texto no RN); remover ao migrar para RN 0.89

## Arquitetura
- **Navegação:** React Navigation — native stack + bottom tabs (Aulas/Boletim)
- **Estado global:** Zustand — tema, sessão e aluno selecionado
- **Persistência:** AsyncStorage — preferência de tema e identificador do responsável autenticado (nunca a senha)
- **Dados:** JSON embarcado em `src/`, acessado por uma camada própria (tipos + funções de consulta), para a UI não depender do formato do arquivo *(planejado)*

## Testes
- **Runner:** Jest (`@react-native/jest-preset`)
- **Unitários:** funções puras, hooks e stores Zustand isolados.
- **Integração:** React Native Testing Library — telas renderizadas com tema, navegação e store reais, validando fluxo do usuário (renderiza → interage → verifica resultado).
- **Fora de escopo:** testes E2E (Detox/Maestro).

## Qualidade de código
- **Lint:** ESLint (`@react-native`)
- **Formatação:** Prettier
- **Commits:** Conventional Commits + commitlint — a config aceita o tipo `conductor` (usado nos commits de plano/track do Conductor).
- **Git hooks:** Husky — lint, typecheck e testes antes de commit/push

## Fora de escopo
- Backend, Firebase ou API remota: os dados vêm do JSON embarcado.

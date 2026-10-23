# Project Workflow

## Princípios

1. **O plano é a fonte da verdade:** todo trabalho é rastreado no `plan.md` da track.
2. **A stack é deliberada:** mudanças de stack são documentadas em `tech-stack.md` *antes* da implementação.
3. **TDD:** testes escritos antes da implementação.
4. **Cobertura ≥ 80%** em código novo (excluindo `src/assets/`, `src/theme/` e `src/types/`).
5. **Experiência primeiro:** seguir `product-guidelines.md` (acessibilidade, animações, microinterações).
6. **Não interativo:** usar `CI=true` em ferramentas com watch mode.
7. **README vivo:** nenhuma track é concluída sem o `README.md` refletir o estado atual do projeto.

## Ciclo de uma task

1. **Selecionar:** próxima task do `plan.md`, em ordem.
2. **Marcar em andamento:** `[ ]` → `[~]` no `plan.md`.
3. **Red:** escrever testes (unitários e/ou integração) que definam o comportamento esperado. Rodar e confirmar que falham.
4. **Green:** implementar o mínimo para os testes passarem. Rodar e confirmar.
5. **Refactor:** melhorar clareza sem mudar comportamento; testes continuam passando.
6. **Cobertura:** `CI=true yarn test --coverage` — meta ≥ 80% no código novo.
7. **Desvios:** se a implementação divergir da `tech-stack.md`: **parar**, atualizar `tech-stack.md` com nota datada, retomar.
8. **Commit:** um commit por task, Conventional Commits, com resumo no corpo (3–5 linhas: o que mudou e por quê).
9. **Registrar SHA:** no `plan.md`, `[~]` → `[x]` + 7 primeiros caracteres do SHA do commit.
10. **Commit do plano:** `conductor(plan): mark task '<nome>' as complete`.

### Correções e ajustes de plano

1. **Ajustes durante a task (`[~]`):** corrigir no próprio fluxo, com testes passando antes do commit.
2. **Correções de review (`conductor-review`):** o review adiciona uma fase `Review Fixes` ao `plan.md`.
3. **Reverter (`conductor-revert`):** desfaz os commits da task e volta o status para `[ ]`.

## Fechamento de fase (checkpoint)

Executado quando a task concluída encerra uma fase do `plan.md`.

1. **Anunciar** início da verificação da fase.
2. **Cobertura da fase:** `git diff --name-only <checkpoint_anterior> HEAD`; todo arquivo de código alterado precisa de teste correspondente (seguindo o padrão dos testes existentes).
3. **Testes automatizados:** anunciar e rodar `CI=true yarn test && yarn lint && yarn tsc --noEmit`. Em falha: até duas tentativas de correção; depois, parar e pedir orientação.
4. **Plano de verificação manual:** com base em `product.md`, `product-guidelines.md` e `plan.md`, passos concretos, por exemplo:
   1. `yarn start` e `yarn ios` (ou `yarn android`)
   2. Navegar até <tela>
   3. Confirmar: <resultado esperado>, nos temas claro e escuro, e com "reduzir movimento" ativado.
5. **Aguardar confirmação explícita** do usuário antes de prosseguir.
6. **Registrar checkpoint:** no `plan.md`, adicionar `[checkpoint: <sha>]` ao título da fase (SHA do último commit funcional da fase).
7. **Commit do plano:** `conductor(plan): mark phase '<nome>' as complete`.

## Quality gates

Antes de marcar uma task como concluída:

- [ ] Todos os testes passam
- [ ] Cobertura ≥ 80% no código novo
- [ ] Segue `code_styleguides/`
- [ ] `yarn tsc --noEmit` sem erros
- [ ] `yarn lint` sem erros
- [ ] Funciona em iOS e Android
- [ ] Funciona nos temas claro e escuro
- [ ] Animações respeitam "reduzir movimento" e não bloqueiam interação
- [ ] Acessibilidade: roles, labels e áreas de toque ≥ 44pt
- [ ] Documentação atualizada se necessário

## Comandos

### Setup
```bash
yarn
bundle install
cd ios && bundle exec pod install && cd ..
```

### Dia a dia
```bash
yarn start          # Metro
yarn ios            # iOS
yarn android        # Android
CI=true yarn test   # testes
yarn lint           # lint
yarn tsc --noEmit   # typecheck
```

### Antes de commitar
```bash
yarn lint && yarn tsc --noEmit && CI=true yarn test
```

## Testes

### Unitários
- Hooks, stores Zustand, utilitários e presets de animação.
- Mockar dependências nativas (Reanimated, Lottie, navegação) via `jest.setup`.
- Cobrir sucesso e falha.

### Integração
- React Native Testing Library, com tela renderizada via `renderWithProviders` (tema + navegação + store reais).
- Fluxo do usuário: renderiza → interage → verifica resultado.
- Consultas por papel/texto acessível.

### Fora de escopo
- E2E (Detox/Maestro).

## Commits

### Formato (Conventional Commits)
```
<type>(<scope>): <descrição>

<resumo de 3–5 linhas>
```

### Tipos
`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `conductor` (artefatos do Conductor).

### Exemplo
```
feat(theme): add light and dark Restyle themes

- Tokens de cor, espaçamento e tipografia
- Hook useAppTheme seguindo esquema do sistema
- Testes unitários dos temas
```

## Definition of Done

Uma task está concluída quando:

1. Implementada conforme a spec
2. Testes escritos e passando
3. Cobertura atendida
4. Lint e typecheck limpos
5. Funciona em iOS e Android, nos dois temas
6. Commit com mensagem e resumo adequados
7. `plan.md` atualizado com status e SHA

Uma **track** está concluída quando todas as fases têm checkpoint e o `README.md` está atualizado.

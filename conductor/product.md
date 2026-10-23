# FiapTeste

## Visão
App mobile (iOS e Android) para responsáveis acompanharem a rotina escolar dos alunos: quais aulas o aluno tem em cada dia e o boletim anual, com notas e faltas. Construído com React Native CLI, TypeScript e um design system tipado (Restyle), com animações em todas as telas.

## Público-alvo
Pais e responsáveis por alunos da escola, que acessam o app no celular para consultas rápidas. Um responsável pode ter mais de um aluno vinculado.

## Funcionalidades

### Splash e tema
- Splash animada na abertura do app.
- Tema escuro por padrão (identidade do produto), com opção de tema claro no cabeçalho; a escolha é lembrada.

### Autenticação
- Login com CPF e senha do responsável.
- Campo de CPF com máscara `XXX.XXX.XXX-XX`.
- Mensagem de erro quando CPF ou senha forem inválidos.
- Sem recuperação de senha nem cadastro.
- Sessão mantida ao fechar e reabrir o app: responsável autenticado abre direto em Aulas.

### Área autenticada (todas as telas)
- Cabeçalho com:
  - primeiro nome do responsável;
  - primeiro nome, RM, turma e período do aluno selecionado;
  - botão para trocar de aluno, só quando houver mais de um vinculado;
  - botão de logout.
- Rodapé com navegação entre **Aulas** e **Boletim**.

### Aulas
- Ao abrir, mostra as aulas de um dia: horário de início e término e a disciplina.
- Navegação entre os dias da semana.

### Boletim
- Ao abrir, mostra o boletim de 2025, com apenas o 1º trimestre avaliado.
- Mostra ano, turma e trimestres, com disciplinas, notas gerais e faltas.
- Navegação entre anos anteriores, quando houver dados.

### Seleção de aluno
- Lista os alunos do responsável: nome completo, RM e turma.
- Após a escolha, volta para a tela anterior.
- Não aparece quando o responsável tem um único aluno; não faz parte do rodapé.

### Estados de erro
- Dados faltando tratados com mensagem clara (ex.: responsável sem alunos vinculados).

## Dados
Responsáveis, alunos, aulas e boletins vêm de um arquivo JSON embarcado no app.

## Não-objetivos
- Versão web.
- Backend próprio, Firebase ou API remota.
- Recuperação de senha e cadastro.

## Critérios de sucesso
- Todas as telas fiéis ao design, funcionando em iOS e Android.
- Toda tela com animação própria, rodando a 60 fps em dispositivos de gama média.
- README com instalação, dependências e demonstrações do app.
- Toda funcionalidade rastreável de ponta a ponta: plano → track → commits.

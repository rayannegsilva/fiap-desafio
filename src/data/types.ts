export type Aula = { horario: string; disciplina: string };

export type AgendaDia = { dia: string; aulas: Aula[] };

export type Disciplina = {
  nome: string;
  nota: number | null;
  faltas: number | null;
};

export type Trimestre = { trimestre: number; disciplinas: Disciplina[] };

export type Boletim = { ano: string; turma: string; trimestres: Trimestre[] };

export type Aluno = {
  rm: number;
  turma: string;
  periodo: string;
  primeiroNome: string;
  sobrenome: string;
  agenda: AgendaDia[];
  boletim: Boletim[];
};

export type Responsavel = {
  id: number;
  cpf: string;
  email: string;
  primeiroNome: string;
  sobrenome: string;
  alunos: Aluno[];
};

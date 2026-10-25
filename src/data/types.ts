export type Lesson = { horario: string; disciplina: string };

export type ScheduleDay = { dia: string; aulas: Lesson[] };

export type Subject = {
  nome: string;
  nota: number | null;
  faltas: number | null;
};

export type Term = { trimestre: number; disciplinas: Subject[] };

export type ReportCard = { ano: string; turma: string; trimestres: Term[] };

export type Student = {
  rm: number;
  turma: string;
  periodo: string;
  primeiroNome: string;
  sobrenome: string;
  agenda: ScheduleDay[];
  boletim: ReportCard[];
};

export type Guardian = {
  id: number;
  cpf: string;
  email: string;
  primeiroNome: string;
  sobrenome: string;
  alunos: Student[];
};

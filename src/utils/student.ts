import type { Student, Guardian } from '../data/types';

const upper = (value: string) => value.toLocaleUpperCase('pt-BR');

export const studentFirstName = (student: Student) =>
  upper(student.primeiroNome);

export const studentFullName = (student: Student) =>
  upper(`${student.primeiroNome} ${student.sobrenome}`);

export const studentInfoLine = (student: Student) =>
  `${student.turma} - RM ${student.rm} - ${student.periodo}`;

export const guardianFirstName = (guardian: Guardian) =>
  upper(guardian.primeiroNome);

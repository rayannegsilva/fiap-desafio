import type { Aluno, Responsavel } from '../data/types';

const upper = (value: string) => value.toLocaleUpperCase('pt-BR');

export const studentFirstName = (aluno: Aluno) => upper(aluno.primeiroNome);

export const studentFullName = (aluno: Aluno) =>
  upper(`${aluno.primeiroNome} ${aluno.sobrenome}`);

export const studentInfoLine = (aluno: Aluno) =>
  `${aluno.turma} - RM ${aluno.rm} - ${aluno.periodo}`;

export const guardianFirstName = (responsavel: Responsavel) =>
  upper(responsavel.primeiroNome);

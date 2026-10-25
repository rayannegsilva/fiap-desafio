import { getResponsavel } from '../data/repository';
import {
  guardianFirstName,
  studentFirstName,
  studentFullName,
  studentInfoLine,
} from './student';

const responsavel = getResponsavel(1)!;
const aluno = responsavel.alunos[0];

it('formats the student names in upper case', () => {
  expect(studentFirstName(aluno)).toBe('RAFAEL');
  expect(studentFullName(aluno)).toBe('RAFAEL DA SILVA');
});

it('formats the student info line', () => {
  expect(studentInfoLine(aluno)).toBe('7EF - RM 12567 - Matutino');
});

it('formats the guardian first name', () => {
  expect(guardianFirstName(responsavel)).toBe('GUSTAVO');
});

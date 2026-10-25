import { getGuardian } from '../data/repository';
import {
  guardianFirstName,
  studentFirstName,
  studentFullName,
  studentInfoLine,
} from './student';

const guardian = getGuardian(1)!;
const student = guardian.alunos[0];

it('formats the student names in upper case', () => {
  expect(studentFirstName(student)).toBe('RAFAEL');
  expect(studentFullName(student)).toBe('RAFAEL DA SILVA');
});

it('formats the student info line', () => {
  expect(studentInfoLine(student)).toBe('7EF - RM 12567 - Matutino');
});

it('formats the guardian first name', () => {
  expect(guardianFirstName(guardian)).toBe('GUSTAVO');
});

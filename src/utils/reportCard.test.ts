import {
  reportCardLabel,
  subjectLabel,
  formatAbsences,
  formatGrade,
  termLabel,
} from './reportCard';

it('formats grades like the data with decimal comma', () => {
  expect(formatGrade(9.5)).toBe('9,5');
  expect(formatGrade(8)).toBe('8');
  expect(formatGrade(10)).toBe('10');
  expect(formatGrade(null)).toBe('-');
});

it('formats absences', () => {
  expect(formatAbsences(0)).toBe('0');
  expect(formatAbsences(3)).toBe('3');
  expect(formatAbsences(null)).toBe('-');
});

it('formats labels', () => {
  expect(reportCardLabel({ ano: '2025', turma: '7EF', trimestres: [] })).toBe(
    '7EF - 2025',
  );
  expect(termLabel(1)).toBe('1º TRIMESTRE');
  expect(subjectLabel('Produção e Interpretação de Textos')).toBe(
    'PRODUÇÃO E INTERPRETAÇÃO DE TEXTOS',
  );
});

import {
  boletimLabel,
  disciplinaLabel,
  formatFaltas,
  formatNota,
  trimestreLabel,
} from './boletim';

it('formats grades like the data with decimal comma', () => {
  expect(formatNota(9.5)).toBe('9,5');
  expect(formatNota(8)).toBe('8');
  expect(formatNota(10)).toBe('10');
  expect(formatNota(null)).toBe('-');
});

it('formats absences', () => {
  expect(formatFaltas(0)).toBe('0');
  expect(formatFaltas(3)).toBe('3');
  expect(formatFaltas(null)).toBe('-');
});

it('formats labels', () => {
  expect(boletimLabel({ ano: '2025', turma: '7EF', trimestres: [] })).toBe(
    '7EF - 2025',
  );
  expect(trimestreLabel(1)).toBe('1º TRIMESTRE');
  expect(disciplinaLabel('Produção e Interpretação de Textos')).toBe(
    'PRODUÇÃO E INTERPRETAÇÃO DE TEXTOS',
  );
});

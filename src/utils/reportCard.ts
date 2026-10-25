import type { ReportCard } from '../data/types';

const EMPTY = '-';

export const formatGrade = (grade: number | null) =>
  grade === null ? EMPTY : String(grade).replace('.', ',');

export const formatAbsences = (absences: number | null) =>
  absences === null ? EMPTY : String(absences);

export const reportCardLabel = ({ turma, ano }: ReportCard) =>
  `${turma} - ${ano}`;

export const termLabel = (n: number) => `${n}º TRIMESTRE`;

export const subjectLabel = (name: string) => name.toLocaleUpperCase('pt-BR');

import type { Boletim } from '../data/types';

const EMPTY = '-';

export const formatNota = (nota: number | null) =>
  nota === null ? EMPTY : String(nota).replace('.', ',');

export const formatFaltas = (faltas: number | null) =>
  faltas === null ? EMPTY : String(faltas);

export const boletimLabel = ({ turma, ano }: Boletim) => `${turma} - ${ano}`;

export const trimestreLabel = (n: number) => `${n}º TRIMESTRE`;

export const disciplinaLabel = (nome: string) =>
  nome.toLocaleUpperCase('pt-BR');

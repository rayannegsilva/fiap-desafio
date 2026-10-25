import type { ScheduleDay } from '../data/types';

const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

const WEEKDAYS = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];

// Weekday read in UTC so the date never shifts with the device time zone.
const parse = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return {
    month,
    day,
    weekday: new Date(Date.UTC(year, month - 1, day)).getUTCDay(),
  };
};

export const formatDayLabel = (isoDate: string) => {
  const { month, day, weekday } = parse(isoDate);
  return `${day} de ${MONTHS[month - 1]}, ${WEEKDAYS[weekday]}`;
};

export const initialDay = (schedule: ScheduleDay[], today: Date) =>
  schedule.find(d => parse(d.dia).weekday === today.getDay()) ??
  schedule[0] ??
  null;

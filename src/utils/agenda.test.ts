import type { ScheduleDay } from '../data/types';
import { formatDayLabel, initialDay } from './agenda';

const agenda: ScheduleDay[] = [16, 17, 18, 19, 20, 21, 22].map(d => ({
  dia: `2025-03-${d}`,
  aulas: [],
}));

it('formats the day label in portuguese', () => {
  expect(formatDayLabel('2025-03-16')).toBe('16 de março, domingo');
  expect(formatDayLabel('2025-03-17')).toBe('17 de março, segunda-feira');
  expect(formatDayLabel('2025-03-22')).toBe('22 de março, sábado');
  expect(formatDayLabel('2025-01-05')).toBe('5 de janeiro, domingo');
});

it('picks the agenda day matching today weekday', () => {
  expect(initialDay(agenda, new Date(2026, 9, 25))?.dia).toBe('2025-03-16');
  expect(initialDay(agenda, new Date(2026, 9, 27))?.dia).toBe('2025-03-18');
});

it('falls back to the first day or null', () => {
  const weekdays = agenda.filter(d => d.dia !== '2025-03-16');
  expect(initialDay(weekdays, new Date(2026, 9, 25))?.dia).toBe('2025-03-17');
  expect(initialDay([], new Date(2026, 9, 25))).toBeNull();
});

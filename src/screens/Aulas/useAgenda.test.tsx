import { act, renderHook } from '@testing-library/react-native';
import { useSessionStore } from '../../store/useSessionStore';
import { useAgenda } from './useAgenda';

beforeEach(() => {
  jest.useFakeTimers({ now: new Date(2026, 9, 27) });
  useSessionStore.setState({ guardianId: 1, studentRm: 12567 });
});

afterEach(() => {
  jest.useRealTimers();
});

it('starts on the day matching today weekday', async () => {
  const { result } = await renderHook(() => useAgenda());
  expect(result.current.selectedDay?.dia).toBe('2025-03-18');
  expect(result.current.days).toHaveLength(7);
});

it('selects another day', async () => {
  const { result } = await renderHook(() => useAgenda());
  await act(() => result.current.selectDay(result.current.days[0]));
  expect(result.current.selectedDay?.dia).toBe('2025-03-16');
});

it('keeps the selected day when switching student', async () => {
  const { result } = await renderHook(() => useAgenda());
  await act(() => result.current.selectDay(result.current.days[3]));
  await act(() => useSessionStore.getState().selectStudent(12568));
  expect(result.current.selectedDay?.dia).toBe('2025-03-19');
  expect(result.current.selectedDay?.aulas[0].disciplina).toBe(
    'Produção e Interpretação de Textos',
  );
});

it('is empty without a session', async () => {
  useSessionStore.setState({ guardianId: null, studentRm: null });
  const { result } = await renderHook(() => useAgenda());
  expect(result.current.days).toEqual([]);
  expect(result.current.selectedDay).toBeNull();
});

import { act, renderHook } from '@testing-library/react-native';
import { useSessionStore } from '../../store/useSessionStore';
import { useReportCard } from './useReportCard';

beforeEach(() => {
  useSessionStore.setState({ guardianId: 1, studentRm: 12567 });
});

it('starts on the most recent year, sorted descending', async () => {
  const { result } = await renderHook(() => useReportCard());
  expect(result.current.reportCards.map(b => b.ano)).toEqual(['2025', '2024']);
  expect(result.current.selected?.ano).toBe('2025');
  expect(result.current.listKey).toBe('12567-2025');
});

it('selects another year', async () => {
  const { result } = await renderHook(() => useReportCard());
  await act(() =>
    result.current.selectReportCard(result.current.reportCards[1]),
  );
  expect(result.current.selected?.ano).toBe('2024');
  expect(result.current.listKey).toBe('12567-2024');
});

it('is empty without a session', async () => {
  useSessionStore.setState({ guardianId: null, studentRm: null });
  const { result } = await renderHook(() => useReportCard());
  expect(result.current.reportCards).toEqual([]);
  expect(result.current.selected).toBeNull();
  expect(result.current.listKey).toBe('');
});

import { act, renderHook } from '@testing-library/react-native';
import { useSessionStore } from '../../store/useSessionStore';
import { useBoletim } from './useBoletim';

beforeEach(() => {
  useSessionStore.setState({ responsavelId: 1, alunoRm: 12567 });
});

it('starts on the most recent year, sorted descending', async () => {
  const { result } = await renderHook(() => useBoletim());
  expect(result.current.boletins.map(b => b.ano)).toEqual(['2025', '2024']);
  expect(result.current.selected?.ano).toBe('2025');
  expect(result.current.listKey).toBe('12567-2025');
});

it('selects another year', async () => {
  const { result } = await renderHook(() => useBoletim());
  await act(() => result.current.selectBoletim(result.current.boletins[1]));
  expect(result.current.selected?.ano).toBe('2024');
  expect(result.current.listKey).toBe('12567-2024');
});

it('resets to the most recent year when switching student', async () => {
  const { result } = await renderHook(() => useBoletim());
  await act(() => result.current.selectBoletim(result.current.boletins[1]));
  await act(() => useSessionStore.getState().selectAluno(12568));
  expect(result.current.selected?.ano).toBe('2025');
  await act(() => useSessionStore.getState().selectAluno(12567));
  expect(result.current.selected?.ano).toBe('2025');
});

it('is empty without a session', async () => {
  useSessionStore.setState({ responsavelId: null, alunoRm: null });
  const { result } = await renderHook(() => useBoletim());
  expect(result.current.boletins).toEqual([]);
  expect(result.current.selected).toBeNull();
  expect(result.current.listKey).toBe('');
});

import { act, renderHook } from '@testing-library/react-native';
import { useSession, useSessionHydrated } from './useSession';
import { useSessionStore } from './useSessionStore';

beforeEach(() => {
  useSessionStore.setState({ responsavelId: null, alunoRm: null });
});

it('resolves the guardian and student of the session', async () => {
  await act(() => useSessionStore.getState().signIn(1, 12567));
  const { result } = await renderHook(() => useSession());
  expect(result.current?.responsavel.primeiroNome).toBe('Gustavo');
  expect(result.current?.aluno.primeiroNome).toBe('Rafael');
});

it('returns null without a session', async () => {
  const { result } = await renderHook(() => useSession());
  expect(result.current).toBeNull();
});

it('clears an orphan session', async () => {
  await act(() => useSessionStore.getState().signIn(999, 1));
  const { result } = await renderHook(() => useSession());
  expect(result.current).toBeNull();
  expect(useSessionStore.getState().responsavelId).toBeNull();
});

it('clears a session whose student does not belong to the guardian', async () => {
  await act(() => useSessionStore.getState().signIn(1, 13752));
  const { result } = await renderHook(() => useSession());
  expect(result.current).toBeNull();
  expect(useSessionStore.getState().responsavelId).toBeNull();
});

it('reports hydration', async () => {
  const { result } = await renderHook(() => useSessionHydrated());
  expect(result.current).toBe(true);
});

it('catches hydration that finishes before the hook subscribes', async () => {
  let done = false;
  const persist = useSessionStore.persist;
  jest.spyOn(persist, 'hasHydrated').mockImplementation(() => done);
  jest.spyOn(persist, 'onFinishHydration').mockImplementation(() => {
    done = true;
    return () => {};
  });
  const { result } = await renderHook(() => useSessionHydrated());
  expect(result.current).toBe(true);
  jest.restoreAllMocks();
});

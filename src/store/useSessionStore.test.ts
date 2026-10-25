import AsyncStorage from '@react-native-async-storage/async-storage';
import { act } from '@testing-library/react-native';
import { useSessionStore } from './useSessionStore';

beforeEach(() => {
  useSessionStore.setState({ guardianId: null, studentRm: null });
});

it('signs in, switches student and signs out', async () => {
  await act(() => useSessionStore.getState().signIn(1, 12567));
  expect(useSessionStore.getState()).toMatchObject({
    guardianId: 1,
    studentRm: 12567,
  });
  await act(() => useSessionStore.getState().selectStudent(12568));
  expect(useSessionStore.getState().studentRm).toBe(12568);
  await act(() => useSessionStore.getState().signOut());
  expect(useSessionStore.getState()).toMatchObject({
    guardianId: null,
    studentRm: null,
  });
});

it('persists only ids, never cpf or password', async () => {
  await act(() => useSessionStore.getState().signIn(1, 12567));
  const raw = (await AsyncStorage.getItem('session-storage'))!;
  expect(JSON.parse(raw).state).toEqual({ guardianId: 1, studentRm: 12567 });
  expect(raw).not.toMatch(/123456|96929456004/);
});

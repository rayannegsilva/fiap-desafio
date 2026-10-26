import AsyncStorage from '@react-native-async-storage/async-storage';
import { act } from '@testing-library/react-native';
import { useSessionStore } from './useSessionStore';

beforeEach(() => {
  useSessionStore.setState({
    guardianId: null,
    studentRm: null,
    switching: false,
  });
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

describe('switchStudent', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('flags switching for the skeleton duration', async () => {
    await act(() => useSessionStore.getState().signIn(1, 12567));
    await act(() => useSessionStore.getState().switchStudent(12568));
    expect(useSessionStore.getState()).toMatchObject({
      studentRm: 12568,
      switching: true,
    });
    await act(() => jest.advanceTimersByTimeAsync(300));
    expect(useSessionStore.getState().switching).toBe(false);
  });

  it('restarts the timer when called again', async () => {
    await act(() => useSessionStore.getState().switchStudent(12568));
    await act(() => jest.advanceTimersByTimeAsync(200));
    await act(() => useSessionStore.getState().switchStudent(12567));
    await act(() => jest.advanceTimersByTimeAsync(200));
    expect(useSessionStore.getState().switching).toBe(true);
    await act(() => jest.advanceTimersByTimeAsync(100));
    expect(useSessionStore.getState().switching).toBe(false);
  });

  it('does not persist switching', async () => {
    await act(() => useSessionStore.getState().signIn(1, 12567));
    await act(() => useSessionStore.getState().switchStudent(12568));
    const raw = (await AsyncStorage.getItem('session-storage'))!;
    expect(JSON.parse(raw).state).toEqual({ guardianId: 1, studentRm: 12568 });
  });
});

describe('rehydration', () => {
  beforeEach(() => {
    useSessionStore.setState({
      hydrated: false,
      guardianId: null,
      studentRm: null,
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('restores a stored session', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValue(
      JSON.stringify({
        state: { guardianId: 1, studentRm: 12567 },
        version: 0,
      }),
    );
    await act(() => useSessionStore.persist.rehydrate());
    expect(useSessionStore.getState()).toMatchObject({
      hydrated: true,
      guardianId: 1,
      studentRm: 12567,
    });
  });

  it('hydrates empty when the stored JSON is invalid', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValue('{not json');
    await act(() => useSessionStore.persist.rehydrate());
    expect(useSessionStore.getState()).toMatchObject({
      hydrated: true,
      guardianId: null,
      studentRm: null,
    });
  });

  it('hydrates empty when storage rejects', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValue(new Error('boom'));
    await act(() => useSessionStore.persist.rehydrate());
    expect(useSessionStore.getState()).toMatchObject({
      hydrated: true,
      guardianId: null,
      studentRm: null,
    });
  });
});

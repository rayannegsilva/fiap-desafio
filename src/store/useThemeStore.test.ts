import AsyncStorage from '@react-native-async-storage/async-storage';
import { act } from '@testing-library/react-native';
import { useThemeStore } from './useThemeStore';

it('follows the system by default', () => {
  expect(useThemeStore.getState().mode).toBe('system');
});

it('stores and persists the chosen mode', async () => {
  await act(() => useThemeStore.getState().setMode('light'));
  expect(useThemeStore.getState().mode).toBe('light');
  const stored = await AsyncStorage.getItem('theme-storage');
  expect(JSON.parse(stored!).state.mode).toBe('light');
});

it('goes back to the system mode', async () => {
  await act(() => useThemeStore.getState().setMode('system'));
  expect(useThemeStore.getState().mode).toBe('system');
});

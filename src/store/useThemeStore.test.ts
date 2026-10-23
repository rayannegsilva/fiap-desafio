import AsyncStorage from '@react-native-async-storage/async-storage';
import { act } from '@testing-library/react-native';
import { useThemeStore } from './useThemeStore';

it('defaults to dark theme', () => {
  expect(useThemeStore.getState().theme).toBe('dark');
});

it('toggles and persists the theme', async () => {
  await act(() => useThemeStore.getState().toggleTheme());
  expect(useThemeStore.getState().theme).toBe('light');
  const stored = await AsyncStorage.getItem('theme-storage');
  expect(JSON.parse(stored!).state.theme).toBe('light');
});

it('toggles back to dark', async () => {
  await act(() => useThemeStore.getState().toggleTheme());
  expect(useThemeStore.getState().theme).toBe('dark');
});

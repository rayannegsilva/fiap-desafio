import { act, renderHook } from '@testing-library/react-native';
import { useThemeStore } from '../store/useThemeStore';
import { darkTheme, lightTheme } from './theme';
import { useAppTheme } from './useAppTheme';

it('returns the dark theme object by default', async () => {
  const { result } = await renderHook(() => useAppTheme());
  expect(result.current).toBe(darkTheme);
});

it('returns the light theme object after toggling', async () => {
  await act(() => useThemeStore.getState().toggleTheme());
  const { result } = await renderHook(() => useAppTheme());
  expect(result.current).toBe(lightTheme);
});

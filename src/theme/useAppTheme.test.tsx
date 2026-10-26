import * as ReactNative from 'react-native';
import { renderHook } from '@testing-library/react-native';
import { darkTheme, lightTheme } from './theme';
import { useAppTheme, useResolvedScheme } from './useAppTheme';

let systemScheme: 'light' | 'dark' | null = null;

beforeEach(() => {
  systemScheme = null;
  jest
    .spyOn(ReactNative, 'useColorScheme')
    .mockImplementation(() => systemScheme);
});

afterEach(() => jest.restoreAllMocks());

it('uses the dark theme when the system has no preference', async () => {
  const { result } = await renderHook(() => useAppTheme());
  expect(result.current).toBe(darkTheme);
});

it('uses the light theme when the system is light', async () => {
  systemScheme = 'light';
  const { result } = await renderHook(() => useAppTheme());
  expect(result.current).toBe(lightTheme);
});

it('uses the dark theme when the system is dark', async () => {
  systemScheme = 'dark';
  const { result } = await renderHook(() => useAppTheme());
  expect(result.current).toBe(darkTheme);
});

it('switches theme live when the system changes', async () => {
  systemScheme = 'dark';
  const { result, rerender } = await renderHook(() => useAppTheme());
  expect(result.current).toBe(darkTheme);
  systemScheme = 'light';
  await rerender({});
  expect(result.current).toBe(lightTheme);
});

it('resolves the scheme name', async () => {
  systemScheme = 'light';
  const { result } = await renderHook(() => useResolvedScheme());
  expect(result.current).toBe('light');
});

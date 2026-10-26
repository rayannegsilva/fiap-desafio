import * as ReactNative from 'react-native';
import { renderHook } from '@testing-library/react-native';
import { darkTheme, lightTheme } from './theme';
import { useNavigationTheme } from './useNavigationTheme';

let systemScheme: 'light' | 'dark' | null = null;

beforeEach(() => {
  systemScheme = null;
  jest
    .spyOn(ReactNative, 'useColorScheme')
    .mockImplementation(() => systemScheme);
});

afterEach(() => jest.restoreAllMocks());

it('is dark with a black background when the system has no preference', async () => {
  const { result } = await renderHook(() => useNavigationTheme());
  expect(result.current.dark).toBe(true);
  expect(result.current.colors.background).toBe('#000000');
});

it('is dark with a black background when the system is dark', async () => {
  systemScheme = 'dark';
  const { result } = await renderHook(() => useNavigationTheme());
  expect(result.current.dark).toBe(true);
  expect(result.current.colors.background).toBe('#000000');
});

it('is light with a white background when the system is light', async () => {
  systemScheme = 'light';
  const { result } = await renderHook(() => useNavigationTheme());
  expect(result.current.dark).toBe(false);
  expect(result.current.colors.background).toBe('#FFFFFF');
});

it.each([
  ['dark', darkTheme],
  ['light', lightTheme],
] as const)(
  'maps the %s palette to the navigation colors',
  async (scheme, theme) => {
    systemScheme = scheme;
    const { result } = await renderHook(() => useNavigationTheme());
    expect(result.current.colors).toMatchObject({
      card: theme.colors.surface,
      text: theme.colors.textPrimary,
      primary: theme.colors.accent,
      border: theme.colors.lineIdle,
      notification: theme.colors.brand,
    });
  },
);

it('switches live when the system changes', async () => {
  systemScheme = 'dark';
  const { result, rerender } = await renderHook(() => useNavigationTheme());
  expect(result.current.dark).toBe(true);
  systemScheme = 'light';
  await rerender({});
  expect(result.current.dark).toBe(false);
  expect(result.current.colors.background).toBe('#FFFFFF');
});

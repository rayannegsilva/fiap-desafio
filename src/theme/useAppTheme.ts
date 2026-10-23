import { useThemeStore } from '../store/useThemeStore';
import { darkTheme, lightTheme, type Theme } from './theme';

export function useAppTheme(): Theme {
  const theme = useThemeStore(s => s.theme);
  return theme === 'dark' ? darkTheme : lightTheme;
}

import { useColorScheme } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { darkTheme, lightTheme, type Theme } from './theme';

export function useResolvedScheme(): 'light' | 'dark' {
  const mode = useThemeStore(s => s.mode);
  const system = useColorScheme();
  if (mode !== 'system') {
    return mode;
  }
  return system === 'light' ? 'light' : 'dark';
}

export function useAppTheme(): Theme {
  return useResolvedScheme() === 'light' ? lightTheme : darkTheme;
}

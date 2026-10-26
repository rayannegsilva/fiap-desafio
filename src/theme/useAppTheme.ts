import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type Theme } from './theme';

export function useResolvedScheme(): 'light' | 'dark' {
  return useColorScheme() === 'light' ? 'light' : 'dark';
}

export function useAppTheme(): Theme {
  return useResolvedScheme() === 'light' ? lightTheme : darkTheme;
}

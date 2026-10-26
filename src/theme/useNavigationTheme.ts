import {
  DarkTheme,
  DefaultTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import { useMemo } from 'react';
import { useAppTheme, useResolvedScheme } from './useAppTheme';

export function useNavigationTheme(): NavigationTheme {
  const scheme = useResolvedScheme();
  const theme = useAppTheme();
  return useMemo(
    () => ({
      ...(scheme === 'dark' ? DarkTheme : DefaultTheme),
      colors: {
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.textPrimary,
        primary: theme.colors.accent,
        border: theme.colors.lineIdle,
        notification: theme.colors.brand,
      },
    }),
    [scheme, theme],
  );
}

import { ThemeProvider } from '@shopify/restyle';
import { NavigationContainer } from '@react-navigation/native';
import type { ReactNode } from 'react';
import { StatusBar } from 'react-native';
import { useAppTheme, useResolvedScheme } from './useAppTheme';

export function AppProviders({ children }: { children: ReactNode }) {
  const theme = useAppTheme();
  const scheme = useResolvedScheme();
  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <NavigationContainer>{children}</NavigationContainer>
    </ThemeProvider>
  );
}

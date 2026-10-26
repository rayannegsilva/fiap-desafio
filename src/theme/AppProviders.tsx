import { ThemeProvider } from '@shopify/restyle';
import { NavigationContainer } from '@react-navigation/native';
import type { ReactNode } from 'react';
import { StatusBar } from 'react-native';
import { useAppTheme, useResolvedScheme } from './useAppTheme';
import { useNavigationTheme } from './useNavigationTheme';

export function AppProviders({ children }: { children: ReactNode }) {
  const theme = useAppTheme();
  const scheme = useResolvedScheme();
  const navigationTheme = useNavigationTheme();
  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <NavigationContainer theme={navigationTheme}>
        {children}
      </NavigationContainer>
    </ThemeProvider>
  );
}

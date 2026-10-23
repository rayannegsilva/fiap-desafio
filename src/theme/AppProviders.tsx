import { ThemeProvider } from '@shopify/restyle';
import { NavigationContainer } from '@react-navigation/native';
import type { ReactNode } from 'react';
import { useAppTheme } from './useAppTheme';

export function AppProviders({ children }: { children: ReactNode }) {
  const theme = useAppTheme();
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>{children}</NavigationContainer>
    </ThemeProvider>
  );
}

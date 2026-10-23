import { ThemeProvider } from '@shopify/restyle';
import type { ReactElement, ReactNode } from 'react';
import { render, type RenderResult } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme/useAppTheme';

function Providers({ children }: { children: ReactNode }) {
  const theme = useAppTheme();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export function renderWithProviders(
  ui: ReactElement,
): Promise<RenderResult> {
  return render(
    <SafeAreaProvider>
      <Providers>{ui}</Providers>
    </SafeAreaProvider>,
  );
}

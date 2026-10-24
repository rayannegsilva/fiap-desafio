import type { ReactElement, ReactNode } from 'react';
import { render, type RenderResult } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from '../theme/AppProviders';

function Providers({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <AppProviders>{children}</AppProviders>
    </SafeAreaProvider>
  );
}

export function renderWithProviders(ui: ReactElement): Promise<RenderResult> {
  return render(ui, { wrapper: Providers });
}

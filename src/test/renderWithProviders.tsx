import type { ReactElement } from 'react';
import { render, type RenderResult } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from '../theme/AppProviders';

export function renderWithProviders(
  ui: ReactElement,
): Promise<RenderResult> {
  return render(
    <SafeAreaProvider>
      <AppProviders>{ui}</AppProviders>
    </SafeAreaProvider>,
  );
}

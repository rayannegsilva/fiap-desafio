import type { ReactElement } from 'react';
import { render, type RenderResult } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export function renderWithProviders(
  ui: ReactElement,
): Promise<RenderResult> {
  return render(<SafeAreaProvider>{ui}</SafeAreaProvider>);
}

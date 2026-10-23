import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from './theme/AppProviders';
import { RootNavigator } from './routes/RootNavigator';

export function App() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <RootNavigator />
      </AppProviders>
    </SafeAreaProvider>
  );
}

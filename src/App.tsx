import { useCallback, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashOverlay } from './components/SplashOverlay/SplashOverlay';
import { AppProviders } from './theme/AppProviders';
import { RootNavigator } from './routes/RootNavigator';

export function App() {
  const [splashDone, setSplashDone] = useState(false);
  const finishSplash = useCallback(() => setSplashDone(true), []);

  return (
    <SafeAreaProvider>
      <AppProviders>
        <RootNavigator />
        {splashDone ? null : <SplashOverlay onFinish={finishSplash} />}
      </AppProviders>
    </SafeAreaProvider>
  );
}

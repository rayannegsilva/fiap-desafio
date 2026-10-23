import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export function App() {
  return (
    <SafeAreaProvider>
      <Text>FiapTeste</Text>
    </SafeAreaProvider>
  );
}

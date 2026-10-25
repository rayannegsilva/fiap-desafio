import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from '../screens/Login/Login';
import { TrocaAluno } from '../screens/TrocaAluno/TrocaAluno';
import { useSessionHydrated } from '../store/useSession';
import { useSessionStore } from '../store/useSessionStore';
import { MainTabNavigator } from './MainTabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const hydrated = useSessionHydrated();
  const signedIn = useSessionStore(s => s.responsavelId !== null);

  if (!hydrated) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {signedIn ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen
            name="TrocaAluno"
            component={TrocaAluno}
            options={{ animation: 'slide_from_bottom' }}
          />
        </>
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
}

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from '../screens/Login/Login';
import { TrocaAluno } from '../screens/TrocaAluno/TrocaAluno';
import { MainTabNavigator } from './MainTabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="TrocaAluno" component={TrocaAluno} />
    </Stack.Navigator>
  );
}

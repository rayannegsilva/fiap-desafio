import {
  createBottomTabNavigator,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Calendar from '../assets/icons/calendar.svg';
import CheckFile from '../assets/icons/check-file.svg';
import { useAppTheme } from '../theme/useAppTheme';
import { Aulas } from '../screens/Aulas/Aulas';
import { Boletim } from '../screens/Boletim/Boletim';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const renderAulasIcon: NonNullable<
  BottomTabNavigationOptions['tabBarIcon']
> = ({ color }) => (
  <Calendar testID="tab-icon-aulas" width={24} height={24} color={color} />
);

const renderBoletimIcon: NonNullable<
  BottomTabNavigationOptions['tabBarIcon']
> = ({ color }) => (
  <CheckFile
    testID="tab-icon-boletim"
    width={24}
    height={24}
    color={color}
  />
);

export function MainTabNavigator() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accentText,
        tabBarInactiveTintColor: theme.colors.textPrimary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          // A lib aplica paddingBottom: insets.bottom dentro da altura fixa;
          // sem somar no Android, a navegação de 3 botões esconde o rodapé.
          height: 64 + (Platform.OS === 'android' ? insets.bottom : 0),
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: theme.textVariants.tab.fontSize,
          fontFamily: theme.textVariants.tab.fontFamily,
        },
      }}
    >
      <Tab.Screen
        name="Aulas"
        component={Aulas}
        options={{ tabBarIcon: renderAulasIcon, tabBarLabel: 'AGENDA' }}
      />
      <Tab.Screen
        name="Boletim"
        component={Boletim}
        options={{ tabBarIcon: renderBoletimIcon, tabBarLabel: 'BOLETIM' }}
      />
    </Tab.Navigator>
  );
}

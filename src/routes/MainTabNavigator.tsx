import {
  createBottomTabNavigator,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
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
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom,
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
        options={{ tabBarIcon: renderAulasIcon }}
      />
      <Tab.Screen
        name="Boletim"
        component={Boletim}
        options={{ tabBarIcon: renderBoletimIcon }}
      />
    </Tab.Navigator>
  );
}

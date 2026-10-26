import {
  createBottomTabNavigator,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Calendar from '../assets/icons/calendar.svg';
import CheckFile from '../assets/icons/check-file.svg';
import { useAppTheme } from '../theme/useAppTheme';
import { Schedule } from '../screens/Schedule/Schedule';
import { ReportCard } from '../screens/ReportCard/ReportCard';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const renderScheduleIcon: NonNullable<
  BottomTabNavigationOptions['tabBarIcon']
> = ({ color }) => (
  <Calendar testID="tab-icon-schedule" width={24} height={24} color={color} />
);

const renderReportCardIcon: NonNullable<
  BottomTabNavigationOptions['tabBarIcon']
> = ({ color }) => (
  <CheckFile
    testID="tab-icon-report-card"
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
        lazy: false,
        animation: 'fade',
        tabBarActiveTintColor: theme.colors.accentText,
        tabBarInactiveTintColor: theme.colors.textPrimary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
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
        name="Schedule"
        component={Schedule}
        options={{ tabBarIcon: renderScheduleIcon, tabBarLabel: 'AGENDA' }}
      />
      <Tab.Screen
        name="ReportCard"
        component={ReportCard}
        options={{ tabBarIcon: renderReportCardIcon, tabBarLabel: 'BOLETIM' }}
      />
    </Tab.Navigator>
  );
}

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Calendar from '../assets/icons/calendar.svg';
import { renderWithProviders } from './renderWithProviders';

describe('safe-area-context', () => {
  it('provides insets inside renderWithProviders', async () => {
    const Probe = () => <Text>{String(useSafeAreaInsets().top)}</Text>;
    await renderWithProviders(<Probe />);
    expect(screen.getByText('0')).toBeOnTheScreen();
  });
});

describe('react-native-svg', () => {
  it('renders an svg icon as a component', async () => {
    await render(<Calendar testID="icon" />);
    expect(screen.getByTestId('icon')).toBeOnTheScreen();
  });
});

describe('react-navigation', () => {
  it('renders a native stack inside bottom tabs', async () => {
    const Stack = createNativeStackNavigator();
    const Tabs = createBottomTabNavigator();
    const Inner = () => (
      <Stack.Navigator>
        <Stack.Screen name="Inner" component={() => <Text>inner</Text>} />
      </Stack.Navigator>
    );
    await renderWithProviders(
      <NavigationContainer>
        <Tabs.Navigator>
          <Tabs.Screen name="One" component={Inner} />
          <Tabs.Screen name="Two" component={() => null} />
        </Tabs.Navigator>
      </NavigationContainer>,
    );
    expect(await screen.findByText('inner')).toBeOnTheScreen();
  });
});

describe('reanimated', () => {
  it('renders an Animated.View with entering animation', async () => {
    await render(
      <Animated.View entering={FadeIn}>
        <Text>ok</Text>
      </Animated.View>,
    );
    expect(screen.getByText('ok')).toBeOnTheScreen();
  });
});

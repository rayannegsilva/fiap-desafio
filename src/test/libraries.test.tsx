import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { act, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
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
    const InnerScreen = () => <Text>inner</Text>;
    const EmptyScreen = () => null;
    const Inner = () => (
      <Stack.Navigator>
        <Stack.Screen name="Inner" component={InnerScreen} />
      </Stack.Navigator>
    );
    await renderWithProviders(
      <Tabs.Navigator>
        <Tabs.Screen name="One" component={Inner} />
        <Tabs.Screen name="Two" component={EmptyScreen} />
      </Tabs.Navigator>,
    );
    expect(await screen.findByText('inner')).toBeOnTheScreen();
  });
});

describe('zustand + async-storage', () => {
  it('persists state to AsyncStorage', async () => {
    const useProbe = create<{ n: number; inc(): void }>()(
      persist(set => ({ n: 0, inc: () => set(s => ({ n: s.n + 1 })) }), {
        name: 'probe',
        storage: createJSONStorage(() => AsyncStorage),
      }),
    );
    await act(() => useProbe.getState().inc());
    const stored = await AsyncStorage.getItem('probe');
    expect(JSON.parse(stored!).state.n).toBe(1);
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

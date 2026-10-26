import { NavigationContext } from '@react-navigation/native';
import { render, screen } from '@testing-library/react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { useFocusEntrance } from './useFocusEntrance';

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  useReducedMotion: jest.fn(() => false),
}));

function Probe() {
  const style = useFocusEntrance(0);
  return <Animated.View testID="probe" style={style} />;
}

function createNavigation(focused: boolean, parentFocused = true) {
  const listeners = new Map<string, Set<() => void>>();
  const navigation = {
    isFocused: () => focused,
    getParent: () => ({ isFocused: () => parentFocused }),
    addListener: (event: string, callback: () => void) => {
      const set = listeners.get(event) ?? new Set();
      listeners.set(event, set);
      set.add(callback);
      return () => set.delete(callback);
    },
  };
  const emit = (event: string) => listeners.get(event)?.forEach(fn => fn());
  return {
    navigation,
    emitFocus: () => emit('focus'),
    emitBlur: () => emit('blur'),
  };
}

function renderFocused(navigation: ReturnType<typeof createNavigation>) {
  return render(
    <NavigationContext.Provider value={navigation.navigation as never}>
      <Probe />
    </NavigationContext.Provider>,
  );
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.mocked(useReducedMotion).mockReturnValue(false);
  jest.useRealTimers();
});

it('is visible immediately when reduce motion is on', async () => {
  jest.mocked(useReducedMotion).mockReturnValue(true);
  await render(<Probe />);
  expect(screen.getByTestId('probe')).toHaveAnimatedStyle({ opacity: 1 });
});

it('animates to visible when focused', async () => {
  await renderFocused(createNavigation(true));
  jest.advanceTimersByTime(2000);
  expect(screen.getByTestId('probe')).toHaveAnimatedStyle({
    opacity: 1,
    transform: [{ translateY: 0 }],
  });
});

it('stays hidden while unfocused and plays once focus arrives', async () => {
  const navigation = createNavigation(false);
  await renderFocused(navigation);
  jest.advanceTimersByTime(2000);
  expect(screen.getByTestId('probe')).toHaveAnimatedStyle({ opacity: 0 });
  navigation.emitBlur();
  navigation.emitFocus();
  jest.advanceTimersByTime(2000);
  expect(screen.getByTestId('probe')).toHaveAnimatedStyle({ opacity: 1 });
});

it('replays after a tab switch blur and focus', async () => {
  const navigation = createNavigation(true);
  await renderFocused(navigation);
  jest.advanceTimersByTime(2000);
  navigation.emitBlur();
  navigation.emitFocus();
  expect(screen.getByTestId('probe')).toHaveAnimatedStyle({ opacity: 0 });
  jest.advanceTimersByTime(2000);
  expect(screen.getByTestId('probe')).toHaveAnimatedStyle({ opacity: 1 });
});

it('does not replay when blurred while the parent is unfocused', async () => {
  const navigation = createNavigation(true, false);
  await renderFocused(navigation);
  jest.advanceTimersByTime(2000);
  navigation.emitBlur();
  navigation.emitFocus();
  expect(screen.getByTestId('probe')).toHaveAnimatedStyle({ opacity: 1 });
});

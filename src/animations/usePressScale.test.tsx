import { Pressable } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import Animated, {
  getAnimatedStyle,
  useReducedMotion,
} from 'react-native-reanimated';
import { usePressScale } from './usePressScale';

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  useReducedMotion: jest.fn(() => false),
}));

function Probe() {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  return (
    <Pressable
      accessibilityRole="button"
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View testID="probe" style={animatedStyle} />
    </Pressable>
  );
}

const scaleOf = (element: Parameters<typeof getAnimatedStyle>[0]) =>
  (getAnimatedStyle(element).transform as [{ scale: number }])[0].scale;

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.mocked(useReducedMotion).mockReturnValue(false);
  jest.useRealTimers();
});

it('scales down while pressed and back on release', async () => {
  await render(<Probe />);
  await fireEvent(screen.getByRole('button'), 'pressIn');
  jest.advanceTimersByTime(2000);
  expect(scaleOf(screen.getByTestId('probe'))).toBeCloseTo(0.96, 1);
  await fireEvent(screen.getByRole('button'), 'pressOut');
  jest.advanceTimersByTime(2000);
  expect(scaleOf(screen.getByTestId('probe'))).toBeCloseTo(1, 1);
});

it('uses opacity instead of scale when reduce motion is on', async () => {
  jest.mocked(useReducedMotion).mockReturnValue(true);
  await render(<Probe />);
  await fireEvent(screen.getByRole('button'), 'pressIn');
  jest.advanceTimersByTime(2000);
  expect(screen.getByTestId('probe')).toHaveAnimatedStyle({
    opacity: 0.7,
    transform: [{ scale: 1 }],
  });
});

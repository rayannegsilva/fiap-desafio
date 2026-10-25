import { act, screen } from '@testing-library/react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { renderWithProviders } from '../../test/renderWithProviders';
import { useSessionHydrated } from '../../store/useSession';
import { useSessionStore } from '../../store/useSessionStore';
import { motion } from '../../theme/motion';
import { SplashOverlay } from './SplashOverlay';

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  useReducedMotion: jest.fn(() => false),
}));

jest.mock('../../store/useSession', () => ({
  useSessionHydrated: jest.fn(() => true),
}));

const { letterDuration, letterStagger, hold, travel, handoff, fadeOut } =
  motion.splash;
const DRAWING = 3 * letterStagger + letterDuration;
const LOGIN_EXIT = DRAWING + hold + travel + handoff + fadeOut;
const MAIN_EXIT = DRAWING + hold + fadeOut;

const TICK = 10;

async function advance(ms: number) {
  for (let elapsed = 0; elapsed < ms; elapsed += TICK) {
    await act(async () => {
      jest.advanceTimersByTime(TICK);
    });
  }
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.mocked(useReducedMotion).mockReturnValue(false);
  jest.mocked(useSessionHydrated).mockReturnValue(true);
  useSessionStore.setState({ guardianId: null, studentRm: null });
});

afterEach(() => {
  jest.useRealTimers();
});

it('waits for hydration before leaving', async () => {
  jest.mocked(useSessionHydrated).mockReturnValue(false);
  const onFinish = jest.fn();
  const view = await renderWithProviders(<SplashOverlay onFinish={onFinish} />);
  await advance(10000);
  expect(onFinish).not.toHaveBeenCalled();

  jest.mocked(useSessionHydrated).mockReturnValue(true);
  await view.rerender(<SplashOverlay onFinish={onFinish} />);
  await advance(LOGIN_EXIT);
  expect(onFinish).toHaveBeenCalledTimes(1);
});

it('finishes the drawing before leaving', async () => {
  useSessionStore.setState({ guardianId: 1, studentRm: 1 });
  const onFinish = jest.fn();
  await renderWithProviders(<SplashOverlay onFinish={onFinish} />);
  await advance(DRAWING - 100);
  expect(onFinish).not.toHaveBeenCalled();
  await advance(MAIN_EXIT);
  expect(onFinish).toHaveBeenCalledTimes(1);
});

it('goes to Login with the logo handoff', async () => {
  const onFinish = jest.fn();
  await renderWithProviders(<SplashOverlay onFinish={onFinish} />);
  await advance(DRAWING + hold + travel - 100);
  expect(screen.queryByLabelText('FIAP School')).toBeNull();
  await advance(200);
  expect(screen.getByLabelText('FIAP School')).toBeOnTheScreen();
  expect(onFinish).not.toHaveBeenCalled();
  await advance(handoff + fadeOut);
  expect(onFinish).toHaveBeenCalledTimes(1);
});

it('fades out to the main screen with a session', async () => {
  useSessionStore.setState({ guardianId: 1, studentRm: 1 });
  const onFinish = jest.fn();
  await renderWithProviders(<SplashOverlay onFinish={onFinish} />);
  await advance(MAIN_EXIT);
  expect(screen.queryByLabelText('FIAP School')).toBeNull();
  expect(onFinish).toHaveBeenCalledTimes(1);
});

it('only fades when reduce motion is on', async () => {
  jest.mocked(useReducedMotion).mockReturnValue(true);
  jest.mocked(useSessionHydrated).mockReturnValue(false);
  const onFinish = jest.fn();
  const view = await renderWithProviders(<SplashOverlay onFinish={onFinish} />);
  await advance(1000);
  expect(onFinish).not.toHaveBeenCalled();

  jest.mocked(useSessionHydrated).mockReturnValue(true);
  await view.rerender(<SplashOverlay onFinish={onFinish} />);
  await advance(fadeOut * 2);
  expect(screen.queryByLabelText('FIAP School')).toBeNull();
  expect(onFinish).toHaveBeenCalledTimes(1);
});

it('blocks touches while visible', async () => {
  await renderWithProviders(<SplashOverlay onFinish={jest.fn()} />);
  expect(screen.getByTestId('splash-overlay').props.pointerEvents).toBe('auto');
});

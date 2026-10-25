import { act, fireEvent, screen } from '@testing-library/react-native';
import { getAnimatedStyle, useReducedMotion } from 'react-native-reanimated';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Text } from '../Text/Text';
import { Collapsible } from './Collapsible';

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  useReducedMotion: jest.fn(() => false),
  measure: jest.fn(() => null),
}));

afterEach(() => {
  jest.mocked(useReducedMotion).mockReturnValue(false);
});

it('starts collapsed and toggles its content', async () => {
  await renderWithProviders(
    <Collapsible title="1º TRIMESTRE" variant="card">
      <Text>MATEMÁTICA I</Text>
    </Collapsible>,
  );
  const header = screen.getByRole('button', { name: '1º TRIMESTRE' });
  expect(header).toBeCollapsed();
  expect(screen.queryByText('MATEMÁTICA I')).toBeNull();
  await fireEvent.press(header);
  expect(header).toBeExpanded();
  expect(screen.getByText('MATEMÁTICA I')).toBeOnTheScreen();
  await fireEvent.press(header);
  expect(screen.queryByText('MATEMÁTICA I')).toBeNull();
});

it('can start expanded', async () => {
  await renderWithProviders(
    <Collapsible title="CIÊNCIAS" variant="row" defaultExpanded>
      <Text>Nota:</Text>
    </Collapsible>,
  );
  expect(screen.getByText('Nota:')).toBeOnTheScreen();
});

it('nests (trimester > subject)', async () => {
  await renderWithProviders(
    <Collapsible title="1º TRIMESTRE" variant="card">
      <Collapsible title="ARTE" variant="row">
        <Text>Faltas:</Text>
      </Collapsible>
    </Collapsible>,
  );
  await fireEvent.press(screen.getByRole('button', { name: '1º TRIMESTRE' }));
  await fireEvent.press(screen.getByRole('button', { name: 'ARTE' }));
  expect(screen.getByText('Faltas:')).toBeOnTheScreen();
});

it('hides collapsed content from accessibility but keeps it mounted', async () => {
  await renderWithProviders(
    <Collapsible title="1º TRIMESTRE" variant="card">
      <Text>MATEMÁTICA I</Text>
    </Collapsible>,
  );
  expect(screen.queryByText('MATEMÁTICA I')).toBeNull();
  expect(
    screen.getByText('MATEMÁTICA I', { includeHiddenElements: true }),
  ).toBeOnTheScreen();
});

it('releases the fixed height once open so nested content can grow', async () => {
  jest.useFakeTimers();
  await renderWithProviders(
    <Collapsible title="1º TRIMESTRE" variant="card">
      <Collapsible title="ARTE" variant="row">
        <Text>Faltas:</Text>
      </Collapsible>
    </Collapsible>,
  );
  await fireEvent.press(screen.getByRole('button', { name: '1º TRIMESTRE' }));
  await fireEvent.press(screen.getByRole('button', { name: 'ARTE' }));
  await act(async () => {
    jest.advanceTimersByTime(500);
  });
  const cardBody =
    screen.getByText('Faltas:').parent!.parent!.parent!.parent!.parent!;
  expect(screen.getByText('Faltas:')).toBeOnTheScreen();
  expect(cardBody).toHaveAnimatedStyle({ height: 'auto' });
  jest.useRealTimers();
});

it('animates the body toward the content height when opening', async () => {
  jest.useFakeTimers();
  await renderWithProviders(
    <Collapsible title="CIÊNCIAS" variant="row">
      <Text>Nota:</Text>
    </Collapsible>,
  );
  const content = screen.getByText('Nota:', { includeHiddenElements: true })
    .parent!;
  const body = content.parent!;
  await fireEvent(content, 'layout', {
    nativeEvent: { layout: { x: 0, y: 0, width: 100, height: 40 } },
  });
  await fireEvent.press(screen.getByRole('button', { name: 'CIÊNCIAS' }));
  await act(async () => {
    jest.advanceTimersByTime(150);
  });
  const height = getAnimatedStyle(body).height as number;
  expect(height).toBeGreaterThan(0);
  expect(height).toBeLessThan(40);
  jest.useRealTimers();
});

it('skips the animation when motion is reduced', async () => {
  jest.mocked(useReducedMotion).mockReturnValue(true);
  await renderWithProviders(
    <Collapsible title="CIÊNCIAS" variant="row">
      <Text>Nota:</Text>
    </Collapsible>,
  );
  const header = screen.getByRole('button', { name: 'CIÊNCIAS' });
  await fireEvent.press(header);
  const body = screen.getByText('Nota:').parent!.parent!;
  expect(body).toHaveAnimatedStyle({ height: 'auto' });
  await fireEvent.press(header);
  expect(screen.queryByText('Nota:')).toBeNull();
});

it('animates the body to zero height when closing from the settled state', async () => {
  jest.useFakeTimers();
  await renderWithProviders(
    <Collapsible title="CIÊNCIAS" variant="row" defaultExpanded>
      <Text>Nota:</Text>
    </Collapsible>,
  );
  const body = screen.getByText('Nota:').parent!.parent!;
  expect(body).toHaveAnimatedStyle({ height: 'auto' });
  await fireEvent.press(screen.getByRole('button', { name: 'CIÊNCIAS' }));
  await act(async () => {
    jest.advanceTimersByTime(500);
  });
  expect(body).toHaveAnimatedStyle({ height: 0 });
  jest.useRealTimers();
});

it('widens the touch target of row headers only', async () => {
  await renderWithProviders(
    <>
      <Collapsible title="CIÊNCIAS" variant="row">
        <Text>a</Text>
      </Collapsible>
      <Collapsible title="1º TRIMESTRE" variant="card">
        <Text>b</Text>
      </Collapsible>
    </>,
  );
  expect(
    screen.getByRole('button', { name: 'CIÊNCIAS' }).props.hitSlop,
  ).toEqual({ top: 4, bottom: 4 });
  expect(
    screen.getByRole('button', { name: '1º TRIMESTRE' }).props.hitSlop,
  ).toBeUndefined();
});

import { act, screen, fireEvent } from '@testing-library/react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { renderWithProviders } from '../../test/renderWithProviders';
import { ConfirmDialog } from './ConfirmDialog';

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  useReducedMotion: jest.fn(() => false),
}));

afterEach(() => {
  jest.mocked(useReducedMotion).mockReturnValue(false);
  jest.useRealTimers();
});

const exitTime = (ms = 400) =>
  act(async () => {
    jest.advanceTimersByTime(ms);
  });

function dialog(visible: boolean, onClosed?: () => void) {
  return (
    <ConfirmDialog
      visible={visible}
      title="Sair da conta?"
      message="Mensagem"
      confirmLabel="SAIR"
      cancelLabel="CANCELAR"
      onConfirm={jest.fn()}
      onCancel={jest.fn()}
      onClosed={onClosed}
    />
  );
}

async function setup(visible = true) {
  const onConfirm = jest.fn();
  const onCancel = jest.fn();
  await renderWithProviders(
    <ConfirmDialog
      visible={visible}
      title="Sair da conta?"
      message="Mensagem"
      confirmLabel="SAIR"
      cancelLabel="CANCELAR"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />,
  );
  return { onConfirm, onCancel };
}

it('renders title, message and actions when visible', async () => {
  await setup();
  expect(screen.getByText('Sair da conta?')).toBeOnTheScreen();
  expect(screen.getByText('Mensagem')).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'SAIR' })).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'CANCELAR' })).toBeOnTheScreen();
});

it('renders nothing when hidden', async () => {
  await setup(false);
  expect(screen.queryByText('Sair da conta?')).not.toBeOnTheScreen();
});

it('calls onConfirm on the confirm button', async () => {
  const { onConfirm, onCancel } = await setup();
  await fireEvent.press(screen.getByRole('button', { name: 'SAIR' }));
  expect(onConfirm).toHaveBeenCalledTimes(1);
  expect(onCancel).not.toHaveBeenCalled();
});

it('calls onCancel on the cancel button', async () => {
  const { onConfirm, onCancel } = await setup();
  await fireEvent.press(screen.getByRole('button', { name: 'CANCELAR' }));
  expect(onCancel).toHaveBeenCalledTimes(1);
  expect(onConfirm).not.toHaveBeenCalled();
});

it('calls onCancel on backdrop press', async () => {
  const { onCancel } = await setup();
  await fireEvent.press(screen.getByTestId('confirm-dialog-backdrop'));
  expect(onCancel).toHaveBeenCalledTimes(1);
});

it('calls onCancel on Android back', async () => {
  const { onCancel } = await setup();
  await fireEvent(screen.getByTestId('confirm-dialog'), 'requestClose');
  expect(onCancel).toHaveBeenCalledTimes(1);
});

it('stays mounted during the exit animation and unmounts after it', async () => {
  jest.useFakeTimers();
  const onClosed = jest.fn();
  const { rerender } = await renderWithProviders(dialog(true, onClosed));
  await rerender(dialog(false, onClosed));
  expect(screen.getByText('Sair da conta?')).toBeOnTheScreen();
  expect(onClosed).not.toHaveBeenCalled();
  await exitTime();
  expect(screen.queryByText('Sair da conta?')).not.toBeOnTheScreen();
  expect(onClosed).toHaveBeenCalledTimes(1);
});

it('keeps the dialog open when reopened during the exit', async () => {
  jest.useFakeTimers();
  const onClosed = jest.fn();
  const { rerender } = await renderWithProviders(dialog(true, onClosed));
  await rerender(dialog(false, onClosed));
  await exitTime(80);
  await rerender(dialog(true, onClosed));
  await exitTime();
  expect(screen.getByText('Sair da conta?')).toBeOnTheScreen();
  expect(onClosed).not.toHaveBeenCalled();
  await rerender(dialog(false, onClosed));
  await exitTime();
  expect(screen.queryByText('Sair da conta?')).not.toBeOnTheScreen();
  expect(onClosed).toHaveBeenCalledTimes(1);
});

it('reopens after a completed exit', async () => {
  jest.useFakeTimers();
  const { rerender } = await renderWithProviders(dialog(true));
  await rerender(dialog(false));
  await exitTime();
  await rerender(dialog(true));
  expect(screen.getByText('Sair da conta?')).toBeOnTheScreen();
});

it('unmounts immediately when motion is reduced', async () => {
  jest.mocked(useReducedMotion).mockReturnValue(true);
  const onClosed = jest.fn();
  const { rerender } = await renderWithProviders(dialog(true, onClosed));
  await rerender(dialog(false, onClosed));
  expect(screen.queryByText('Sair da conta?')).not.toBeOnTheScreen();
  expect(onClosed).toHaveBeenCalledTimes(1);
});

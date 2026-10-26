import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../test/renderWithProviders';
import { ConfirmDialog } from './ConfirmDialog';

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

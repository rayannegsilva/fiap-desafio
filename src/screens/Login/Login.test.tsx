import { TextInput } from 'react-native';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { AUTH_DELAY_MS } from '../../data/repository';
import { useSessionStore } from '../../store/useSessionStore';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Login } from './Login';

beforeEach(() => {
  jest.useFakeTimers();
  useSessionStore.setState({ responsavelId: null, alunoRm: null });
});

async function fillAndSubmit(cpf: string, senha: string) {
  await fireEvent.changeText(screen.getByLabelText('CPF'), cpf);
  await fireEvent.changeText(screen.getByLabelText('SENHA'), senha);
  await fireEvent.press(screen.getByRole('button', { name: 'FAZER LOGIN' }));
}

afterEach(() => {
  jest.useRealTimers();
});

it('starts with the login button disabled', async () => {
  await renderWithProviders(<Login />);
  expect(screen.getByRole('button', { name: 'FAZER LOGIN' })).toBeDisabled();
  expect(screen.getByRole('image', { name: 'FIAP School' })).toBeOnTheScreen();
});

it('masks the cpf and enables the button when the form is complete', async () => {
  await renderWithProviders(<Login />);
  await fireEvent.changeText(screen.getByLabelText('CPF'), '96929456004');
  await fireEvent.changeText(screen.getByLabelText('SENHA'), '123456');
  expect(screen.getByLabelText('CPF')).toHaveProp('value', '969.294.560-04');
  expect(screen.getByRole('button', { name: 'FAZER LOGIN' })).toBeEnabled();
});

it('shows loading and then signs in with valid credentials', async () => {
  await renderWithProviders(<Login />);
  await fillAndSubmit('96929456004', '123456');
  expect(screen.getByRole('button', { name: 'FAZER LOGIN' })).toBeBusy();

  await act(() => jest.advanceTimersByTimeAsync(AUTH_DELAY_MS));
  expect(useSessionStore.getState().responsavelId).toBe(1);
});

it('shows the generic error on invalid credentials', async () => {
  await renderWithProviders(<Login />);
  await fillAndSubmit('96929456004', 'errada');
  await act(() => jest.advanceTimersByTimeAsync(AUTH_DELAY_MS));
  expect(
    screen.getByText('Usuário ou senha inválida. Pode tentar novamente?'),
  ).toBeOnTheScreen();
  expect(useSessionStore.getState().responsavelId).toBeNull();
});

it('moves focus to the password field when submitting the cpf', async () => {
  const focus = jest.spyOn(TextInput.prototype, 'focus');
  await renderWithProviders(<Login />);
  await fireEvent(screen.getByLabelText('CPF'), 'submitEditing');
  expect(focus).toHaveBeenCalled();
});

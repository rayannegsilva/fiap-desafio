import { Keyboard, StyleSheet, TextInput } from 'react-native';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { AUTH_DELAY_MS } from '../../data/repository';
import { useSessionStore } from '../../store/useSessionStore';
import { renderWithProviders } from '../../test/renderWithProviders';
import { darkTheme } from '../../theme/theme';
import { Login } from './Login';

beforeEach(() => {
  jest.useFakeTimers();
  useSessionStore.setState({ guardianId: null, studentRm: null });
});

async function fillAndSubmit(cpf: string, password: string) {
  await fireEvent.changeText(screen.getByLabelText('CPF'), cpf);
  await fireEvent.changeText(screen.getByLabelText('SENHA'), password);
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

it('keeps ios autocorrect off the masked cpf field', async () => {
  await renderWithProviders(<Login />);
  const cpf = screen.getByLabelText('CPF');
  expect(cpf).toHaveProp('autoCorrect', false);
  expect(cpf).toHaveProp('maxLength', 14);
});

it('shows loading and then signs in with valid credentials', async () => {
  await renderWithProviders(<Login />);
  await fillAndSubmit('96929456004', '123456');
  expect(screen.getByRole('button', { name: 'FAZER LOGIN' })).toBeBusy();

  await act(() => jest.advanceTimersByTimeAsync(AUTH_DELAY_MS));
  expect(useSessionStore.getState().guardianId).toBe(1);
});

it('shows the generic error on invalid credentials', async () => {
  await renderWithProviders(<Login />);
  await fillAndSubmit('96929456004', 'errada');
  await act(() => jest.advanceTimersByTimeAsync(AUTH_DELAY_MS));
  expect(
    screen.getByText('Usuário ou senha inválida. Pode tentar novamente?'),
  ).toBeOnTheScreen();
  expect(useSessionStore.getState().guardianId).toBeNull();
});

it('moves focus to the password field when submitting the cpf', async () => {
  const focus = jest.spyOn(TextInput.prototype, 'focus');
  await renderWithProviders(<Login />);
  await fireEvent(screen.getByLabelText('CPF'), 'submitEditing');
  expect(focus).toHaveBeenCalled();
});

describe('with the keyboard open', () => {
  it('drops the bottom inset padding under the button', async () => {
    const hook = require('../../hooks/useKeyboardVisible');
    jest.spyOn(hook, 'useKeyboardVisible').mockReturnValue(true);
    await renderWithProviders(<Login />);
    expect(screen.getByTestId('login-footer')).toHaveStyle({
      paddingBottom: 0,
    });
    expect(
      StyleSheet.flatten(
        screen.getByTestId('login-scroll').props.contentContainerStyle,
      ),
    ).toMatchObject({ paddingBottom: 24 });
    expect(
      screen.getByRole('button', { name: 'FAZER LOGIN' }),
    ).toBeOnTheScreen();
    jest.restoreAllMocks();
  });
});

it('paints the keyboard avoiding area with the theme background', async () => {
  await renderWithProviders(<Login />);
  expect(
    StyleSheet.flatten(screen.getByTestId('login-screen').props.style),
  ).toMatchObject({
    backgroundColor: darkTheme.colors.background,
  });
});

it('dismisses the keyboard when tapping outside the inputs', async () => {
  const dismiss = jest.spyOn(Keyboard, 'dismiss');
  await renderWithProviders(<Login />);
  await fireEvent.press(screen.getByTestId('login-dismiss-keyboard'));
  expect(dismiss).toHaveBeenCalled();
});

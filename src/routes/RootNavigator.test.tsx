import { act, fireEvent, screen } from '@testing-library/react-native';
import { AUTH_DELAY_MS } from '../data/repository';
import { useSessionStore } from '../store/useSessionStore';
import { renderWithProviders } from '../test/renderWithProviders';
import { RootNavigator } from './RootNavigator';

afterEach(() => {
  jest.useRealTimers();
});

beforeEach(() => {
  useSessionStore.setState({ responsavelId: null, alunoRm: null });
});

it('starts on the Login screen without a session', async () => {
  await renderWithProviders(<RootNavigator />);
  expect(screen.getByLabelText('CPF')).toBeOnTheScreen();
});

it('opens Main without ever showing Login when a session exists', async () => {
  useSessionStore.getState().signIn(1, 12567);
  await renderWithProviders(<RootNavigator />);
  expect(screen.queryByLabelText('CPF')).not.toBeOnTheScreen();
  expect(
    await screen.findByLabelText('Trocar aluno (temporário)'),
  ).toBeOnTheScreen();
});

it('goes from Login to Main after a valid login', async () => {
  jest.useFakeTimers();
  await renderWithProviders(<RootNavigator />);
  await fireEvent.changeText(screen.getByLabelText('CPF'), '96929456004');
  await fireEvent.changeText(screen.getByLabelText('SENHA'), '123456');
  await fireEvent.press(screen.getByRole('button', { name: 'FAZER LOGIN' }));
  await act(() => jest.advanceTimersByTimeAsync(AUTH_DELAY_MS));

  expect(
    await screen.findByLabelText('Trocar aluno (temporário)'),
  ).toBeOnTheScreen();
  expect(screen.queryByLabelText('CPF')).not.toBeOnTheScreen();
});

import { collectByProp } from '../test/collectByProp';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { AUTH_DELAY_MS } from '../data/repository';
import { useSessionStore } from '../store/useSessionStore';
import { renderWithProviders } from '../test/renderWithProviders';
import { RootNavigator } from './RootNavigator';

afterEach(() => {
  jest.useRealTimers();
});

beforeEach(() => {
  useSessionStore.setState({ guardianId: null, studentRm: null });
});

it('starts on the Login screen without a session', async () => {
  await renderWithProviders(<RootNavigator />);
  expect(screen.getByLabelText('CPF')).toBeOnTheScreen();
});

it('opens Main without ever showing Login when a session exists', async () => {
  useSessionStore.getState().signIn(1, 12567);
  await renderWithProviders(<RootNavigator />);
  expect(screen.queryByLabelText('CPF')).not.toBeOnTheScreen();
  expect(await screen.findByText('GUSTAVO')).toBeOnTheScreen();
});

it('goes from Login to Main after a valid login', async () => {
  jest.useFakeTimers();
  await renderWithProviders(<RootNavigator />);
  await fireEvent.changeText(screen.getByLabelText('CPF'), '96929456004');
  await fireEvent.changeText(screen.getByLabelText('SENHA'), '123456');
  await fireEvent.press(screen.getByRole('button', { name: 'FAZER LOGIN' }));
  await act(() => jest.advanceTimersByTimeAsync(AUTH_DELAY_MS));

  expect(await screen.findByText('GUSTAVO')).toBeOnTheScreen();
  expect(screen.queryByLabelText('CPF')).not.toBeOnTheScreen();
});

it('switches student from the header and signs out', async () => {
  jest.useFakeTimers();
  await renderWithProviders(<RootNavigator />);
  await fireEvent.changeText(screen.getByLabelText('CPF'), '96929456004');
  await fireEvent.changeText(screen.getByLabelText('SENHA'), '123456');
  await fireEvent.press(screen.getByRole('button', { name: 'FAZER LOGIN' }));
  await act(() => jest.advanceTimersByTimeAsync(AUTH_DELAY_MS));
  expect(await screen.findByText('GUSTAVO')).toBeOnTheScreen();

  await fireEvent.press(screen.getByRole('button', { name: 'TROCAR PERFIL' }));
  await fireEvent.press(
    await screen.findByRole('button', { name: /^JOANA DA SILVA,/ }),
  );
  await act(() => jest.advanceTimersByTimeAsync(1000));
  expect(await screen.findByText('JOANA')).toBeOnTheScreen();
  expect(screen.getByText('2EM - RM 12568 - Matutino')).toBeOnTheScreen();

  await fireEvent.press(screen.getByRole('button', { name: 'SAIR' }));
  await fireEvent.press(screen.getAllByRole('button', { name: 'SAIR' })[1]);
  expect(await screen.findByLabelText('CPF')).toBeOnTheScreen();
});

it('fades between Login and Main', async () => {
  await renderWithProviders(<RootNavigator />);
  const faded = collectByProp(screen.root, 'stackAnimation', 'fade');
  expect(faded.length).toBeGreaterThan(0);
});

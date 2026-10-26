import { act, fireEvent, screen } from '@testing-library/react-native';
import { useSessionStore } from '../../store/useSessionStore';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Header } from './Header';

beforeEach(() => {
  useSessionStore.setState({ guardianId: null, studentRm: null });
});

it('shows the logo and TROCAR PERFIL for several students', async () => {
  useSessionStore.getState().signIn(1, 12567);
  await renderWithProviders(<Header />);
  expect(screen.getByRole('image', { name: 'FIAP School' })).toBeOnTheScreen();
  expect(
    screen.getByRole('button', { name: 'TROCAR PERFIL' }),
  ).toBeOnTheScreen();
});

it('hides TROCAR PERFIL when the guardian has a single student', async () => {
  useSessionStore.getState().signIn(2, 13752);
  await renderWithProviders(<Header />);
  expect(
    screen.queryByRole('button', { name: 'TROCAR PERFIL' }),
  ).not.toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'SAIR' })).toBeOnTheScreen();
});

it('opens the confirmation on SAIR without signing out', async () => {
  useSessionStore.getState().signIn(1, 12567);
  await renderWithProviders(<Header />);
  await fireEvent.press(screen.getByRole('button', { name: 'SAIR' }));
  expect(screen.getByText('Sair da conta?')).toBeOnTheScreen();
  expect(useSessionStore.getState().guardianId).toBe(1);
});

it('signs out only after the dialog finishes closing', async () => {
  jest.useFakeTimers();
  useSessionStore.getState().signIn(1, 12567);
  await renderWithProviders(<Header />);
  await fireEvent.press(screen.getByRole('button', { name: 'SAIR' }));
  await fireEvent.press(screen.getAllByRole('button', { name: 'SAIR' })[1]);
  expect(useSessionStore.getState().guardianId).toBe(1);
  await act(async () => {
    jest.advanceTimersByTime(400);
  });
  expect(useSessionStore.getState().guardianId).toBeNull();
  jest.useRealTimers();
});

it('keeps the session when the confirmation is cancelled', async () => {
  jest.useFakeTimers();
  useSessionStore.getState().signIn(1, 12567);
  await renderWithProviders(<Header />);
  await fireEvent.press(screen.getByRole('button', { name: 'SAIR' }));
  await fireEvent.press(screen.getByRole('button', { name: 'CANCELAR' }));
  await act(async () => {
    jest.advanceTimersByTime(400);
  });
  expect(screen.queryByText('Sair da conta?')).not.toBeOnTheScreen();
  expect(useSessionStore.getState().guardianId).toBe(1);
  jest.useRealTimers();
});

it('renders nothing without a session', async () => {
  await renderWithProviders(<Header />);
  expect(screen.queryByRole('button', { name: 'SAIR' })).not.toBeOnTheScreen();
});

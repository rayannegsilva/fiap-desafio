import { fireEvent, screen } from '@testing-library/react-native';
import { useSessionStore } from '../../store/useSessionStore';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Header } from './Header';

beforeEach(() => {
  useSessionStore.setState({ guardianId: null, studentRm: null });
});

it('shows greeting, student and info line', async () => {
  useSessionStore.getState().signIn(1, 12567);
  await renderWithProviders(<Header />);
  expect(screen.getByText('GUSTAVO')).toBeOnTheScreen();
  expect(screen.getByRole('header', { name: 'RAFAEL' })).toBeOnTheScreen();
  expect(screen.getByText('7EF - RM 12567 - Matutino')).toBeOnTheScreen();
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

it('signs out on SAIR', async () => {
  useSessionStore.getState().signIn(1, 12567);
  await renderWithProviders(<Header />);
  await fireEvent.press(screen.getByRole('button', { name: 'SAIR' }));
  expect(useSessionStore.getState().guardianId).toBeNull();
});

it('renders nothing without a session', async () => {
  await renderWithProviders(<Header />);
  expect(screen.queryByRole('button', { name: 'SAIR' })).not.toBeOnTheScreen();
});

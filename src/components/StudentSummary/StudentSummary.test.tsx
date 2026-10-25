import { screen } from '@testing-library/react-native';
import { useSessionStore } from '../../store/useSessionStore';
import { renderWithProviders } from '../../test/renderWithProviders';
import { StudentSummary } from './StudentSummary';

beforeEach(() => {
  useSessionStore.setState({ guardianId: null, studentRm: null });
});

it('shows greeting, student and info line', async () => {
  useSessionStore.getState().signIn(1, 12567);
  await renderWithProviders(<StudentSummary />);
  expect(screen.getByText('GUSTAVO')).toBeOnTheScreen();
  expect(screen.getByRole('header', { name: 'RAFAEL' })).toBeOnTheScreen();
  expect(screen.getByText('7EF - RM 12567 - Matutino')).toBeOnTheScreen();
});

it('renders nothing without a session', async () => {
  await renderWithProviders(<StudentSummary />);
  expect(screen.queryByRole('header')).not.toBeOnTheScreen();
});

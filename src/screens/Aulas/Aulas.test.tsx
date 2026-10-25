import { fireEvent, screen } from '@testing-library/react-native';
import { useSessionStore } from '../../store/useSessionStore';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Aulas } from './Aulas';

beforeEach(() => {
  jest.useFakeTimers({ now: new Date(2026, 9, 27) });
  useSessionStore.setState({ guardianId: null, studentRm: null });
  useSessionStore.getState().signIn(1, 12567);
});

afterEach(() => {
  jest.useRealTimers();
});

it('shows the classes of today weekday', async () => {
  await renderWithProviders(<Aulas />);
  expect(screen.getByRole('button', { name: 'SAIR' })).toBeOnTheScreen();
  expect(screen.getByText('AGENDA')).toBeOnTheScreen();
  expect(screen.getByText('18 de março, terça-feira')).toBeOnTheScreen();
  expect(screen.getAllByText(/^\d{2}:\d{2} - \d{2}:\d{2}$/)).toHaveLength(6);
  expect(screen.getByText('Matemática II')).toBeOnTheScreen();
  expect(screen.queryByLabelText('Trocar aluno (temporário)')).toBeNull();
});

it('switches day from the dropdown', async () => {
  await renderWithProviders(<Aulas />);
  await fireEvent.press(screen.getByRole('button', { name: 'Dia da agenda' }));
  await fireEvent.press(
    screen.getByRole('button', { name: '16 de março, domingo' }),
  );
  expect(screen.getByText('Sem aulas neste dia')).toBeOnTheScreen();
});

it('shows only the header without a session', async () => {
  useSessionStore.setState({ guardianId: null, studentRm: null });
  await renderWithProviders(<Aulas />);
  expect(screen.getByText('AGENDA')).toBeOnTheScreen();
  expect(screen.queryByRole('button', { name: 'Dia da agenda' })).toBeNull();
});

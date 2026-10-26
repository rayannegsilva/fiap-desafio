import { fireEvent, screen, within } from '@testing-library/react-native';
import { useSessionStore } from '../../store/useSessionStore';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Schedule } from './Schedule';

beforeEach(() => {
  jest.useFakeTimers({ now: new Date(2026, 9, 27) });
  useSessionStore.setState({ guardianId: null, studentRm: null });
  useSessionStore.getState().signIn(1, 12567);
});

afterEach(() => {
  jest.useRealTimers();
});

it('shows the classes of today weekday', async () => {
  await renderWithProviders(<Schedule />);
  expect(screen.getByRole('button', { name: 'SAIR' })).toBeOnTheScreen();
  expect(screen.getByText('AGENDA')).toBeOnTheScreen();
  expect(screen.getByText('18 de março, terça-feira')).toBeOnTheScreen();
  expect(screen.getAllByText(/^\d{2}:\d{2} - \d{2}:\d{2}$/)).toHaveLength(6);
  expect(screen.getByText('Matemática II')).toBeOnTheScreen();
  expect(screen.queryByLabelText('Trocar aluno (temporário)')).toBeNull();
});

it('fades the class list out when it is replaced', async () => {
  await renderWithProviders(<Schedule />);
  expect(screen.getByTestId('schedule-list').props.exiting).toBeDefined();
});

it('switches day from the dropdown', async () => {
  await renderWithProviders(<Schedule />);
  await fireEvent.press(screen.getByRole('button', { name: 'Dia da agenda' }));
  await fireEvent.press(
    screen.getByRole('button', { name: '16 de março, domingo' }),
  );
  expect(screen.getByText('Sem aulas neste dia')).toBeOnTheScreen();
});

it('shows only the header without a session', async () => {
  useSessionStore.setState({ guardianId: null, studentRm: null });
  await renderWithProviders(<Schedule />);
  expect(screen.getByText('AGENDA')).toBeOnTheScreen();
  expect(screen.queryByRole('button', { name: 'Dia da agenda' })).toBeNull();
});

it('scrolls the greeting together with the content', async () => {
  await renderWithProviders(<Schedule />);
  const scroll = screen.getByTestId('schedule-scroll');
  expect(within(scroll).getByText('GUSTAVO')).toBeOnTheScreen();
  expect(
    within(scroll).getByText('7EF - RM 12567 - Matutino'),
  ).toBeOnTheScreen();
});

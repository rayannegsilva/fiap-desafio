import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { useSessionStore } from '../../store/useSessionStore';
import { renderWithProviders } from '../../test/renderWithProviders';
import { ReportCard } from './ReportCard';

beforeEach(() => {
  useSessionStore.setState({ guardianId: null, studentRm: null });
  useSessionStore.getState().signIn(1, 12567);
});

it('shows the most recent year with closed trimesters', async () => {
  await renderWithProviders(<ReportCard />);
  expect(screen.getByRole('button', { name: 'SAIR' })).toBeOnTheScreen();
  expect(screen.getByText('BOLETIM')).toBeOnTheScreen();
  expect(screen.getByText('7EF - 2025')).toBeOnTheScreen();
  for (const n of [1, 2, 3]) {
    expect(
      screen.getByRole('button', { name: `${n}º TRIMESTRE`, expanded: false }),
    ).toBeOnTheScreen();
  }
});

it('opens a trimester and a subject', async () => {
  await renderWithProviders(<ReportCard />);
  await fireEvent.press(screen.getByRole('button', { name: '1º TRIMESTRE' }));
  await fireEvent.press(
    screen.getByRole('button', { name: 'LÍNGUA PORTUGUESA' }),
  );
  expect(screen.getByText('Nota:')).toBeOnTheScreen();
});

it('fades the term list out when it is replaced', async () => {
  await renderWithProviders(<ReportCard />);
  expect(screen.getByTestId('report-card-list').props.exiting).toBeDefined();
});

it('switches year from the dropdown', async () => {
  await renderWithProviders(<ReportCard />);
  await fireEvent.press(screen.getByRole('button', { name: 'Ano do boletim' }));
  await fireEvent.press(screen.getByRole('button', { name: '6EF - 2024' }));
  await waitFor(() =>
    expect(
      screen.getByRole('button', { name: 'Ano do boletim' }),
    ).toHaveAccessibilityValue({ text: '6EF - 2024' }),
  );
  expect(
    screen.getByRole('button', { name: '1º TRIMESTRE', expanded: false }),
  ).toBeOnTheScreen();
});

it('shows a static year box for a single year', async () => {
  useSessionStore.getState().signIn(1, 12568);
  await renderWithProviders(<ReportCard />);
  expect(screen.getByText('2EM - 2025')).toBeOnTheScreen();
  expect(screen.queryByRole('button', { name: 'Ano do boletim' })).toBeNull();
});

it('resets to the most recent year when switching student', async () => {
  await renderWithProviders(<ReportCard />);
  await fireEvent.press(screen.getByRole('button', { name: 'Ano do boletim' }));
  await fireEvent.press(screen.getByRole('button', { name: '6EF - 2024' }));
  await act(() => useSessionStore.getState().selectStudent(12568));
  expect(screen.getByText('2EM - 2025')).toBeOnTheScreen();
  await act(() => useSessionStore.getState().selectStudent(12567));
  expect(screen.getByText('7EF - 2025')).toBeOnTheScreen();
});

it('scrolls the greeting together with the content', async () => {
  await renderWithProviders(<ReportCard />);
  const scroll = screen.getByTestId('report-card-scroll');
  expect(scroll.props.showsVerticalScrollIndicator).toBe(false);
  expect(within(scroll).getByText('GUSTAVO')).toBeOnTheScreen();
  expect(
    within(scroll).getByText('7EF - RM 12567 - Matutino'),
  ).toBeOnTheScreen();
});

it('shows the skeleton while switching and the content after', async () => {
  jest.useFakeTimers();
  await renderWithProviders(<ReportCard />);
  await act(() => useSessionStore.getState().switchStudent(12568));
  expect(screen.getByLabelText('Carregando boletim')).toBeOnTheScreen();
  expect(screen.getByText('JOANA')).toBeOnTheScreen();
  await act(() => jest.advanceTimersByTimeAsync(300));
  expect(screen.queryByLabelText('Carregando boletim')).toBeNull();
  expect(screen.getByText('2EM - 2025')).toBeOnTheScreen();
  jest.useRealTimers();
});

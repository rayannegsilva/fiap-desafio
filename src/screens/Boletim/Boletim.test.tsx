import { fireEvent, screen } from '@testing-library/react-native';
import { useSessionStore } from '../../store/useSessionStore';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Boletim } from './Boletim';

beforeEach(() => {
  useSessionStore.setState({ responsavelId: null, alunoRm: null });
  useSessionStore.getState().signIn(1, 12567);
});

it('shows the most recent year with closed trimesters', async () => {
  await renderWithProviders(<Boletim />);
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
  await renderWithProviders(<Boletim />);
  await fireEvent.press(screen.getByRole('button', { name: '1º TRIMESTRE' }));
  await fireEvent.press(
    screen.getByRole('button', { name: 'LÍNGUA PORTUGUESA' }),
  );
  expect(screen.getByText('Nota:')).toBeOnTheScreen();
});

it('switches year from the dropdown', async () => {
  await renderWithProviders(<Boletim />);
  await fireEvent.press(screen.getByRole('button', { name: 'Ano do boletim' }));
  await fireEvent.press(screen.getByRole('button', { name: '6EF - 2024' }));
  expect(screen.getByText('6EF - 2024')).toBeOnTheScreen();
  expect(
    screen.getByRole('button', { name: '1º TRIMESTRE', expanded: false }),
  ).toBeOnTheScreen();
});

it('shows a static year box for a single year', async () => {
  useSessionStore.getState().signIn(1, 12568);
  await renderWithProviders(<Boletim />);
  expect(screen.getByText('2EM - 2025')).toBeOnTheScreen();
  expect(screen.queryByRole('button', { name: 'Ano do boletim' })).toBeNull();
});

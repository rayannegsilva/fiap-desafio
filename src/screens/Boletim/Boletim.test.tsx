import { screen } from '@testing-library/react-native';
import { useSessionStore } from '../../store/useSessionStore';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Boletim } from './Boletim';

beforeEach(() => {
  useSessionStore.setState({ responsavelId: null, alunoRm: null });
  useSessionStore.getState().signIn(1, 12567);
});

it('renders the header and the screen title', async () => {
  await renderWithProviders(<Boletim />);
  expect(screen.getByText('Boletim')).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'SAIR' })).toBeOnTheScreen();
});

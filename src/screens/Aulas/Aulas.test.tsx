import { screen } from '@testing-library/react-native';
import { useSessionStore } from '../../store/useSessionStore';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Aulas } from './Aulas';

beforeEach(() => {
  useSessionStore.setState({ responsavelId: null, alunoRm: null });
  useSessionStore.getState().signIn(1, 12567);
});

it('renders the header and the screen title', async () => {
  await renderWithProviders(<Aulas />);
  expect(screen.getByText('Aulas')).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'SAIR' })).toBeOnTheScreen();
  expect(screen.queryByLabelText('Trocar aluno (temporário)')).toBeNull();
});

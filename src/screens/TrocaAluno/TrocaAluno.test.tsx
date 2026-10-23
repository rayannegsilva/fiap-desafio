import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../test/renderWithProviders';
import { TrocaAluno } from './TrocaAluno';

it('renders the screen title', async () => {
  await renderWithProviders(<TrocaAluno />);
  expect(screen.getByText('Troca de aluno')).toBeOnTheScreen();
});

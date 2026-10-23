import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../test/renderWithProviders';
import { RootNavigator } from './RootNavigator';

it('starts on the Login screen', async () => {
  await renderWithProviders(<RootNavigator />);
  expect(screen.getByText('Login')).toBeOnTheScreen();
});

it('walks Login -> Main (Aulas) -> TrocaAluno via the temporary buttons', async () => {
  await renderWithProviders(<RootNavigator />);
  await fireEvent.press(screen.getByLabelText('Entrar (temporário)'));
  expect(
    await screen.findByLabelText('Trocar aluno (temporário)'),
  ).toBeOnTheScreen();

  await fireEvent.press(screen.getByLabelText('Trocar aluno (temporário)'));
  expect(await screen.findByText('Troca de aluno')).toBeOnTheScreen();
});

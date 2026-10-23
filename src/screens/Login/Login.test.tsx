import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Login } from './Login';

it('renders the screen title', async () => {
  await renderWithProviders(<Login />);
  expect(screen.getByText('Login')).toBeOnTheScreen();
});

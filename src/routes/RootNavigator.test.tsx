import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../test/renderWithProviders';
import { RootNavigator } from './RootNavigator';

it('starts on the Login screen', async () => {
  await renderWithProviders(<RootNavigator />);
  expect(screen.getByText('Login')).toBeOnTheScreen();
});

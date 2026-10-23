import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Aulas } from './Aulas';

it('renders the screen title', async () => {
  await renderWithProviders(<Aulas />);
  expect(screen.getByText('Aulas')).toBeOnTheScreen();
});

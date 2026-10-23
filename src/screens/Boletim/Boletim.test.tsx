import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Boletim } from './Boletim';

it('renders the screen title', async () => {
  await renderWithProviders(<Boletim />);
  expect(screen.getByText('Boletim')).toBeOnTheScreen();
});

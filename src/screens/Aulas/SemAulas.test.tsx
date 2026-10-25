import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../test/renderWithProviders';
import { SemAulas } from './SemAulas';

it('shows the empty message', async () => {
  await renderWithProviders(<SemAulas />);
  expect(screen.getByText('Sem aulas neste dia')).toBeOnTheScreen();
});

import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../test/renderWithProviders';
import { EmptyDay } from './EmptyDay';

it('shows the empty message', async () => {
  await renderWithProviders(<EmptyDay />);
  expect(screen.getByText('Sem aulas neste dia')).toBeOnTheScreen();
});

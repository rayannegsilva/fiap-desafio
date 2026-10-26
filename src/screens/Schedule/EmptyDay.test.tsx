import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../test/renderWithProviders';
import { EmptyDay } from './EmptyDay';

it('shows the empty message', async () => {
  await renderWithProviders(<EmptyDay />);
  expect(screen.getByText('Sem aulas neste dia')).toBeOnTheScreen();
});

it('fades out when removed', async () => {
  await renderWithProviders(<EmptyDay />);
  expect(screen.getByTestId('empty-day').props.exiting).toBeDefined();
});

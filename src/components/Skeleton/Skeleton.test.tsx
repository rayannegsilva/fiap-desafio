import { StyleSheet } from 'react-native';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Skeleton } from './Skeleton';

it('renders a sized block hidden from accessibility', async () => {
  await renderWithProviders(
    <Skeleton width={80} height={12} radius="none" testID="block" />,
  );
  const style = StyleSheet.flatten(screen.getByTestId('block').props.style);
  expect(style).toMatchObject({ width: 80, height: 12, borderRadius: 0 });
});

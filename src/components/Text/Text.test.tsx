import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Text } from './Text';

it('defaults to the body variant', async () => {
  await renderWithProviders(<Text>olá</Text>);
  expect(screen.getByText('olá')).toHaveStyle({
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  });
});

it('limits dynamic font scaling by default and allows override', async () => {
  await renderWithProviders(
    <>
      <Text>a</Text>
      <Text maxFontSizeMultiplier={2}>b</Text>
    </>,
  );
  expect(screen.getByText('a').props.maxFontSizeMultiplier).toBe(1.3);
  expect(screen.getByText('b').props.maxFontSizeMultiplier).toBe(2);
});

it('forwards native props', async () => {
  await renderWithProviders(
    <Text numberOfLines={1} accessibilityRole="header">
      t
    </Text>,
  );
  expect(screen.getByRole('header')).toHaveProp('numberOfLines', 1);
});

import { fireEvent, screen } from '@testing-library/react-native';
import Close from '../../assets/icons/close.svg';
import { renderWithProviders } from '../../test/renderWithProviders';
import { darkTheme } from '../../theme/theme';
import { TextButton } from './TextButton';

it('calls onPress and exposes an accessible button', async () => {
  const onPress = jest.fn();
  await renderWithProviders(<TextButton label="SAIR" onPress={onPress} />);
  await fireEvent.press(screen.getByRole('button', { name: 'SAIR' }));
  expect(onPress).toHaveBeenCalledTimes(1);
});

it('extends the touch area to at least 44pt', async () => {
  await renderWithProviders(<TextButton label="SAIR" onPress={jest.fn()} />);
  expect(screen.getByRole('button', { name: 'SAIR' })).toHaveProp('hitSlop', {
    top: 15,
    bottom: 15,
    left: 12,
    right: 12,
  });
});

it('tints the icon with the variant text color', async () => {
  await renderWithProviders(
    <TextButton
      label="FECHAR"
      variant="cardTitle"
      icon={Close}
      onPress={jest.fn()}
    />,
  );
  expect(screen.getByTestId('text-button-icon').props.color).toBe(
    darkTheme.colors.accentText,
  );
});

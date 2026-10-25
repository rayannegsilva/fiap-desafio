import { fireEvent, screen } from '@testing-library/react-native';
import Close from '../../assets/icons/close.svg';
import Logout from '../../assets/icons/logout.svg';
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

it('keeps the label on a single clipped line', async () => {
  await renderWithProviders(
    <TextButton label="TROCAR PERFIL" onPress={jest.fn()} />,
  );
  const label = screen.getByText('TROCAR PERFIL');
  expect(label).toHaveProp('numberOfLines', 1);
  expect(label).toHaveProp('ellipsizeMode', 'clip');
  expect(label.props.children).toBe('TROCAR\u00A0PERFIL');
  expect(screen.getByRole('button', { name: 'TROCAR PERFIL' })).toBeTruthy();
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

it('places the icon after the label', async () => {
  await renderWithProviders(
    <TextButton label="SAIR" icon={Logout} iconSize={10} onPress={jest.fn()} />,
  );
  const json = JSON.stringify(screen.toJSON());
  const textAt = json.indexOf('["SAIR"]');
  expect(textAt).toBeGreaterThan(-1);
  expect(json.indexOf('text-button-icon')).toBeGreaterThan(textAt);
});

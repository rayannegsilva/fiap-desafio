import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../test/renderWithProviders';
import { darkTheme } from '../../theme/theme';
import { PrimaryButton } from './PrimaryButton';

it('calls onPress when enabled', async () => {
  const onPress = jest.fn();
  await renderWithProviders(
    <PrimaryButton label="FAZER LOGIN" onPress={onPress} />,
  );
  await fireEvent.press(screen.getByRole('button', { name: 'FAZER LOGIN' }));
  expect(onPress).toHaveBeenCalledTimes(1);
});

it('is disabled with dimmed label and ignores presses', async () => {
  const onPress = jest.fn();
  await renderWithProviders(
    <PrimaryButton label="FAZER LOGIN" onPress={onPress} disabled />,
  );
  const button = screen.getByRole('button', { name: 'FAZER LOGIN' });
  expect(button).toBeDisabled();
  expect(screen.getByText('FAZER LOGIN')).toHaveStyle({
    color: darkTheme.colors.textDisabled,
  });
  await fireEvent.press(button);
  expect(onPress).not.toHaveBeenCalled();
});

it('shows a spinner instead of the label while loading and ignores presses', async () => {
  const onPress = jest.fn();
  await renderWithProviders(
    <PrimaryButton label="FAZER LOGIN" onPress={onPress} loading />,
  );
  const button = screen.getByRole('button', { name: 'FAZER LOGIN' });
  expect(button).toBeBusy();
  expect(screen.queryByText('FAZER LOGIN')).toBeNull();
  await fireEvent.press(button);
  expect(onPress).not.toHaveBeenCalled();
});

it('fades its content when switching between label and spinner', async () => {
  await renderWithProviders(
    <PrimaryButton label="FAZER LOGIN" onPress={jest.fn()} />,
  );
  const content = screen.getByTestId('primary-button-content');
  expect(content.props.entering).toBeDefined();
  expect(content.props.exiting).toBeDefined();
});

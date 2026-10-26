import { createRef, type ComponentRef } from 'react';
import { TextInput } from 'react-native';
import { fireEvent, screen } from '@testing-library/react-native';
import { getAnimatedStyle, useReducedMotion } from 'react-native-reanimated';
import { renderWithProviders } from '../../test/renderWithProviders';
import { darkTheme } from '../../theme/theme';
import { TextField } from './TextField';

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  useReducedMotion: jest.fn(() => false),
}));

afterEach(() => {
  jest.mocked(useReducedMotion).mockReturnValue(false);
  jest.useRealTimers();
});

it('labels the input and forwards native props', async () => {
  const onChangeText = jest.fn();
  await renderWithProviders(
    <TextField
      label="SENHA"
      value=""
      onChangeText={onChangeText}
      secureTextEntry
    />,
  );
  const input = screen.getByLabelText('SENHA');
  expect(input).toHaveProp('secureTextEntry', true);
  await fireEvent.changeText(input, '123');
  expect(onChangeText).toHaveBeenCalledWith('123');
});

it('switches the underline color when filled', async () => {
  const { rerender } = await renderWithProviders(
    <TextField label="CPF" value="" />,
  );
  expect(screen.getByTestId('text-field-underline')).toHaveStyle({
    backgroundColor: darkTheme.colors.lineIdle,
  });
  await rerender(<TextField label="CPF" value="123" />);
  expect(screen.getByTestId('text-field-underline')).toHaveStyle({
    backgroundColor: darkTheme.colors.lineActive,
  });
});

it('shows the error message', async () => {
  await renderWithProviders(
    <TextField
      label="CPF"
      value="1"
      error="Usuário ou senha inválida. Pode tentar novamente?"
    />,
  );
  expect(
    screen.getByText('Usuário ou senha inválida. Pode tentar novamente?'),
  ).toHaveStyle({ color: darkTheme.colors.accentText });
});

it('does not shake when reduce motion is on', async () => {
  jest.mocked(useReducedMotion).mockReturnValue(true);
  jest.useFakeTimers();
  const { rerender } = await renderWithProviders(
    <TextField label="CPF" value="1" />,
  );
  await rerender(<TextField label="CPF" value="1" error="erro" />);
  jest.advanceTimersByTime(40);
  expect(screen.getByTestId('text-field-container')).toHaveAnimatedStyle({
    transform: [{ translateX: 0 }],
  });
});

it('shakes horizontally when an error appears', async () => {
  jest.useFakeTimers();
  const { rerender } = await renderWithProviders(
    <TextField label="CPF" value="1" />,
  );
  await rerender(<TextField label="CPF" value="1" error="erro" />);
  jest.advanceTimersByTime(30);
  const { transform } = getAnimatedStyle(
    screen.getByTestId('text-field-container'),
  );
  expect((transform as [{ translateX: number }])[0].translateX).not.toBe(0);
});

it('centers the label', async () => {
  await renderWithProviders(<TextField label="CPF" value="" />);
  expect(screen.getByText('CPF')).toHaveStyle({ textAlign: 'center' });
});

it('forwards the ref to the TextInput', async () => {
  const ref = createRef<ComponentRef<typeof TextInput>>();
  await renderWithProviders(<TextField label="CPF" ref={ref} />);
  expect(ref.current?.focus).toEqual(expect.any(Function));
});

it('colors the cursor and selection with accentText', async () => {
  await renderWithProviders(<TextField label="CPF" />);
  const input = screen.getByLabelText('CPF');
  expect(input).toHaveProp('cursorColor', darkTheme.colors.accentText);
  expect(input).toHaveProp('selectionColor', darkTheme.colors.accentText);
});

it('fades the error message in and out', async () => {
  await renderWithProviders(<TextField label="CPF" value="1" error="erro" />);
  const error = screen.getByTestId('text-field-error');
  expect(error.props.entering).toBeDefined();
  expect(error.props.exiting).toBeDefined();
});

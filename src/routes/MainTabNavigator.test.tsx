import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../test/renderWithProviders';
import { darkTheme } from '../theme/theme';
import { MainTabNavigator } from './MainTabNavigator';

function visibleIconColor(testId: string) {
  // react-navigation renders each tab icon twice (crossfade between
  // focused/unfocused tint); only the wrapper with opacity 1 is shown.
  const icons = screen.getAllByTestId(testId);
  const visible = icons.find(icon => {
    const style = icon.parent?.props.style;
    const flat = Array.isArray(style) ? Object.assign({}, ...style) : style;
    return flat?.opacity === 1;
  });
  return visible?.props.color;
}

it('tints the active tab icon with accentText and the inactive one with textPrimary', async () => {
  await renderWithProviders(<MainTabNavigator />);
  expect(visibleIconColor('tab-icon-aulas')).toBe(darkTheme.colors.accentText);
  expect(visibleIconColor('tab-icon-boletim')).toBe(
    darkTheme.colors.textPrimary,
  );
});

it('switches to Boletim when its tab is pressed', async () => {
  await renderWithProviders(<MainTabNavigator />);
  expect(screen.getAllByText('Boletim')).toHaveLength(1); // só o rótulo da aba
  await fireEvent.press(screen.getByLabelText(/^Boletim/));
  await waitFor(() => {
    expect(screen.getAllByText('Boletim')).toHaveLength(2); // rótulo + conteúdo da tela
  });
});

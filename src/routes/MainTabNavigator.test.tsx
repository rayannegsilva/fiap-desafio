import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { renderWithProviders } from '../test/renderWithProviders';
import { darkTheme } from '../theme/theme';
import { MainTabNavigator } from './MainTabNavigator';

function visibleIconColor(testId: string) {
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
  expect(visibleIconColor('tab-icon-schedule')).toBe(
    darkTheme.colors.accentText,
  );
  expect(visibleIconColor('tab-icon-report-card')).toBe(
    darkTheme.colors.textPrimary,
  );
});

function tabBarHeight() {
  for (const label of screen.getAllByText('AGENDA')) {
    for (let node = label.parent; node; node = node.parent) {
      const style = StyleSheet.flatten(node.props.style);
      if (style?.backgroundColor === darkTheme.colors.surface) {
        return style.height;
      }
    }
  }
}

describe('tab bar height', () => {
  const BOTTOM_INSET = 48;
  const metrics = {
    frame: { x: 0, y: 0, width: 390, height: 844 },
    insets: { top: 0, right: 0, bottom: BOTTOM_INSET, left: 0 },
  };

  const renderWithInset = () =>
    renderWithProviders(
      <SafeAreaProvider initialMetrics={metrics}>
        <MainTabNavigator />
      </SafeAreaProvider>,
    );

  afterEach(() => jest.restoreAllMocks());

  it('adds the bottom inset on android so 3-button navigation does not hide it', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');
    await renderWithInset();
    expect(tabBarHeight()).toBe(64 + BOTTOM_INSET);
  });

  it('keeps the design height on ios', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');
    await renderWithInset();
    expect(tabBarHeight()).toBe(64);
  });
});

it('switches to ReportCard when its tab is pressed', async () => {
  await renderWithProviders(<MainTabNavigator />);
  expect(screen.getAllByText('BOLETIM')).toHaveLength(1);
  await fireEvent.press(screen.getByRole('button', { name: /BOLETIM/ }));
  await waitFor(() => {
    expect(screen.getAllByText('BOLETIM').length).toBeGreaterThan(1);
  });
});

it('labels the tabs AGENDA and BOLETIM', async () => {
  await renderWithProviders(<MainTabNavigator />);
  expect(screen.getByRole('button', { name: /AGENDA/ })).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: /BOLETIM/ })).toBeOnTheScreen();
});

it('mounts the ReportCard screen before its tab is visited', async () => {
  await renderWithProviders(<MainTabNavigator />);
  expect(
    screen.getAllByText('BOLETIM', { includeHiddenElements: true }).length,
  ).toBeGreaterThan(1);
});

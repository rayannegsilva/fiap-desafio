import { darkTheme, lightTheme } from './theme';

it('dark theme uses the figma background and accent tokens', () => {
  expect(darkTheme.colors.background).toBe('#000000');
  expect(darkTheme.colors.accent).toBe('#29F4D5');
  expect(darkTheme.colors.accentText).toBe('#29F4D5');
});

it('light theme derives accentText for AA contrast, keeping accent', () => {
  expect(lightTheme.colors.background).toBe('#FFFFFF');
  expect(lightTheme.colors.accent).toBe('#29F4D5');
  expect(lightTheme.colors.accentText).toBe('#006B5D');
});

it('exposes all 14 typography variants plus the restyle default', () => {
  const variants = Object.keys(darkTheme.textVariants);
  expect(variants).toEqual(
    expect.arrayContaining([
      'defaults',
      'inputValue',
      'greeting',
      'screenTitle',
      'sectionTitle',
      'button',
      'label',
      'emptyState',
      'body',
      'bodyMedium',
      'bodyStrong',
      'error',
      'cardTitle',
      'caption',
      'captionMedium',
      'tab',
    ]),
  );
});

it('bodyStrong variant matches the figma spec (16/20 semibold)', () => {
  expect(darkTheme.textVariants.bodyStrong).toMatchObject({
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Montserrat-SemiBold',
  });
});

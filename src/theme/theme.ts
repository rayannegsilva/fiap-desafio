import { createTheme } from '@shopify/restyle';
import { darkPalette, lightPalette } from './palette';

const textVariants = {
  defaults: {},
  inputValue: {
    fontSize: 32,
    lineHeight: 39,
    fontFamily: 'Montserrat-Regular',
    color: 'textPrimary',
  },
  greeting: {
    fontSize: 24,
    lineHeight: 29,
    fontFamily: 'Montserrat-Regular',
    color: 'textPrimary',
  },
  greetingName: {
    fontSize: 24,
    lineHeight: 29,
    fontFamily: 'Montserrat-Bold',
    color: 'textPrimary',
  },
  screenTitle: {
    fontSize: 24,
    lineHeight: 29,
    fontFamily: 'Montserrat-Regular',
    color: 'textPrimary',
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Montserrat-Bold',
    color: 'accentText',
  },
  button: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Montserrat-Medium',
    color: 'onAccent',
  },
  label: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Montserrat-Regular',
    color: 'textPrimary',
  },
  emptyState: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Montserrat-Regular',
    color: 'textPrimary',
  },
  body: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Montserrat-Regular',
    color: 'textPrimary',
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Montserrat-Medium',
    color: 'textPrimary',
  },
  bodyStrong: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Montserrat-SemiBold',
    color: 'textPrimary',
  },
  error: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Montserrat-Medium',
    color: 'accentText',
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Montserrat-Bold',
    color: 'accentText',
  },
  caption: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'Montserrat-Regular',
    color: 'textPrimary',
  },
  captionMedium: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'Montserrat-Medium',
    color: 'textPrimary',
  },
  tab: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Montserrat-Bold',
    color: 'textPrimary',
  },
} as const;

const spacing = {
  none: 0,
  xs: 4,
  s: 8,
  sm: 12,
  m: 16,
  l: 24,
  xl: 28,
  xl2: 36,
  xxl: 48,
};

const borderRadii = {
  none: 0,
  default: 8,
};

export const darkTheme = createTheme({
  colors: darkPalette,
  spacing,
  borderRadii,
  textVariants,
});

export const lightTheme = createTheme({
  ...darkTheme,
  colors: lightPalette,
});

export type Theme = typeof darkTheme;

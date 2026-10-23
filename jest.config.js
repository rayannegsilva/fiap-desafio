module.exports = {
  preset: '@react-native/jest-preset',
  resolver: 'react-native-reanimated/jest/resolver',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native[^/]*|@react-native[^/]*|@react-navigation|@shopify/restyle|lottie-react-native)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/assets/**',
    '!src/theme/**',
    '!src/types/**',
    '!src/test/**',
  ],
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
};

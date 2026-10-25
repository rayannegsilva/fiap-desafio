require('react-native-reanimated').setUpTests();

jest.mock('react-native-worklets', () =>
  require('react-native-worklets/lib/module/mock'),
);

jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest'),
);

beforeEach(() => {
  jest.spyOn(require('react-native'), 'useColorScheme').mockReturnValue('dark');
});

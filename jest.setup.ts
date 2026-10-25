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

jest.mock('lottie-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return React.forwardRef((props: object, ref: unknown) =>
    React.createElement(View, { ...props, ref }),
  );
});

beforeEach(() => {
  jest.spyOn(require('react-native'), 'useColorScheme').mockReturnValue('dark');
});

import { Keyboard, Platform } from 'react-native';
import { act, renderHook } from '@testing-library/react-native';
import { useKeyboardVisible } from './useKeyboardVisible';

const showEvent =
  Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
const hideEvent =
  Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

function setup() {
  const handlers: Record<string, () => void> = {};
  const remove = jest.fn();
  jest.spyOn(Keyboard, 'addListener').mockImplementation(((
    name: string,
    cb: () => void,
  ) => {
    handlers[name] = cb;
    return { remove };
  }) as never);
  return { handlers, remove };
}

afterEach(() => jest.restoreAllMocks());

it('tracks keyboard visibility and unsubscribes on unmount', async () => {
  const { handlers, remove } = setup();
  const { result, unmount } = await renderHook(() => useKeyboardVisible());
  expect(result.current).toBe(false);

  await act(() => handlers[showEvent]());
  expect(result.current).toBe(true);

  await act(() => handlers[hideEvent]());
  expect(result.current).toBe(false);

  await unmount();
  expect(remove).toHaveBeenCalledTimes(2);
});

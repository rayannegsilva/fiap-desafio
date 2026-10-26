import { act, fireEvent, screen, within } from '@testing-library/react-native';
import { useSessionStore } from '../../store/useSessionStore';
import { renderWithProviders } from '../../test/renderWithProviders';
import { StudentSwitch } from './StudentSwitch';

const mockGoBack = jest.fn();
const mockUnsubscribe = jest.fn();
let transitionEnd: (e: { data: { closing: boolean } }) => void;
const mockAddListener = jest.fn(
  (_event: string, handler: typeof transitionEnd) => {
    transitionEnd = handler;
    return mockUnsubscribe;
  },
);
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: mockGoBack, addListener: mockAddListener }),
}));

afterEach(() => {
  jest.useRealTimers();
});

beforeEach(() => {
  jest.useFakeTimers();
  mockGoBack.mockClear();
  mockUnsubscribe.mockClear();
  mockAddListener.mockClear();
  useSessionStore.setState({ guardianId: null, studentRm: null });
  useSessionStore.getState().signIn(1, 12567);
});

it('lists the students with the current one selected', async () => {
  await renderWithProviders(<StudentSwitch />);
  expect(
    screen.getByText('Escolha o perfil que você quer visualizar'),
  ).toBeOnTheScreen();
  expect(
    screen.getByRole('button', { name: /^RAFAEL DA SILVA,/, selected: true }),
  ).toBeOnTheScreen();
  expect(
    screen.getByRole('button', { name: /^JOANA DA SILVA,/, selected: false }),
  ).toBeOnTheScreen();
  expect(screen.getByText('7EF - RM 12567 - Matutino')).toBeOnTheScreen();
  expect(screen.getByText('2EM - RM 12568 - Matutino')).toBeOnTheScreen();
});

async function pressJoana() {
  await fireEvent.press(
    screen.getByRole('button', { name: /^JOANA DA SILVA,/ }),
  );
}

it('goes back first and commits the student when the dismiss ends', async () => {
  await renderWithProviders(<StudentSwitch />);
  await pressJoana();
  expect(mockGoBack).toHaveBeenCalledTimes(1);
  expect(useSessionStore.getState().studentRm).toBe(12567);
  expect(
    screen.getByRole('button', { name: /^JOANA DA SILVA,/, selected: true }),
  ).toBeOnTheScreen();
  await act(async () => transitionEnd({ data: { closing: true } }));
  expect(useSessionStore.getState().studentRm).toBe(12568);
  expect(mockUnsubscribe).toHaveBeenCalled();
});

it('ignores opening transitions', async () => {
  await renderWithProviders(<StudentSwitch />);
  await pressJoana();
  await act(async () => transitionEnd({ data: { closing: false } }));
  expect(useSessionStore.getState().studentRm).toBe(12567);
});

it('commits through the fallback timer when no event fires', async () => {
  await renderWithProviders(<StudentSwitch />);
  await pressJoana();
  await act(() => jest.advanceTimersByTimeAsync(450));
  expect(useSessionStore.getState().studentRm).toBe(12568);
  expect(mockUnsubscribe).toHaveBeenCalled();
});

it('ignores a second press while pending', async () => {
  await renderWithProviders(<StudentSwitch />);
  await pressJoana();
  await fireEvent.press(
    screen.getByRole('button', { name: /^RAFAEL DA SILVA,/ }),
  );
  expect(mockGoBack).toHaveBeenCalledTimes(1);
  await act(() => jest.advanceTimersByTimeAsync(450));
  expect(useSessionStore.getState().studentRm).toBe(12568);
});

it('goes back on FECHAR without switching', async () => {
  await renderWithProviders(<StudentSwitch />);
  await fireEvent.press(screen.getByRole('button', { name: 'FECHAR' }));
  expect(useSessionStore.getState().studentRm).toBe(12567);
  expect(mockGoBack).toHaveBeenCalledTimes(1);
});

it('renders the cards inside a scroll view', async () => {
  await renderWithProviders(<StudentSwitch />);
  const scroll = screen.getByTestId('student-switch-scroll');
  expect(
    within(scroll).getByRole('button', { name: /^JOANA DA SILVA,/ }),
  ).toBeOnTheScreen();
});

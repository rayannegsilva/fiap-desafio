import { fireEvent, screen, within } from '@testing-library/react-native';
import { useSessionStore } from '../../store/useSessionStore';
import { renderWithProviders } from '../../test/renderWithProviders';
import { StudentSwitch } from './StudentSwitch';

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: mockGoBack }),
}));

beforeEach(() => {
  mockGoBack.mockClear();
  useSessionStore.setState({ guardianId: null, studentRm: null });
  useSessionStore.getState().signIn(1, 12567);
});

it('lists the students with the current one selected', async () => {
  await renderWithProviders(<StudentSwitch />);
  expect(
    screen.getByText('Escolha o perfil que você quer visualizar'),
  ).toBeOnTheScreen();
  expect(
    screen.getByRole('button', { name: 'RAFAEL DA SILVA', selected: true }),
  ).toBeOnTheScreen();
  expect(
    screen.getByRole('button', { name: 'JOANA DA SILVA', selected: false }),
  ).toBeOnTheScreen();
  expect(screen.getByText('7EF - RM 12567 - Matutino')).toBeOnTheScreen();
  expect(screen.getByText('2EM - RM 12568 - Matutino')).toBeOnTheScreen();
});

it('selects the pressed student and goes back', async () => {
  await renderWithProviders(<StudentSwitch />);
  await fireEvent.press(screen.getByRole('button', { name: 'JOANA DA SILVA' }));
  expect(useSessionStore.getState().studentRm).toBe(12568);
  expect(mockGoBack).toHaveBeenCalledTimes(1);
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
    within(scroll).getByRole('button', { name: 'JOANA DA SILVA' }),
  ).toBeOnTheScreen();
});

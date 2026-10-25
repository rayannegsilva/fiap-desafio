import { render, screen } from '@testing-library/react-native';
import { App } from './App';
import { useSessionStore } from './store/useSessionStore';

it('renders the app starting on Login without a session', async () => {
  useSessionStore.setState({ responsavelId: null, alunoRm: null });
  await render(<App />);
  expect(screen.getByLabelText('CPF')).toBeOnTheScreen();
});

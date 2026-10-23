import { render, screen } from '@testing-library/react-native';
import { App } from './App';

it('renders the app root', async () => {
  await render(<App />);
  expect(screen.getByText('FiapTeste')).toBeOnTheScreen();
});

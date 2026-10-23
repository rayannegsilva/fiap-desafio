import { render, screen } from '@testing-library/react-native';
import { App } from './App';

it('renders the app starting on Login', async () => {
  await render(<App />);
  expect(screen.getByText('Login')).toBeOnTheScreen();
});

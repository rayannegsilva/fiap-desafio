import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../test/renderWithProviders';
import { AulaItem } from './AulaItem';

it('shows time and subject', async () => {
  await renderWithProviders(
    <AulaItem
      aula={{ horario: '07:15 - 08:00', disciplina: 'Matemática I' }}
      index={0}
    />,
  );
  expect(screen.getByText('07:15 - 08:00')).toBeOnTheScreen();
  expect(screen.getByText('Matemática I')).toBeOnTheScreen();
});

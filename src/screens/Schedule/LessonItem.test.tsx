import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../test/renderWithProviders';
import { LessonItem } from './LessonItem';

it('shows time and subject', async () => {
  await renderWithProviders(
    <LessonItem
      lesson={{ horario: '07:15 - 08:00', disciplina: 'Matemática I' }}
      index={0}
    />,
  );
  expect(screen.getByText('07:15 - 08:00')).toBeOnTheScreen();
  expect(screen.getByText('Matemática I')).toBeOnTheScreen();
});

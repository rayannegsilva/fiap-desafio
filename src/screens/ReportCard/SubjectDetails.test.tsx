import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../test/renderWithProviders';
import { SubjectDetails } from './SubjectDetails';

it('shows grade and absences', async () => {
  await renderWithProviders(
    <SubjectDetails
      subject={{ nome: 'Língua Portuguesa', nota: 9.5, faltas: 0 }}
    />,
  );
  expect(screen.getByText('Nota:')).toBeOnTheScreen();
  expect(screen.getByText('9,5')).toBeOnTheScreen();
  expect(screen.getByText('Faltas:')).toBeOnTheScreen();
  expect(screen.getByText('0')).toBeOnTheScreen();
});

it('shows dashes without evaluation', async () => {
  await renderWithProviders(
    <SubjectDetails
      subject={{ nome: 'Língua Portuguesa', nota: null, faltas: null }}
    />,
  );
  expect(screen.getAllByText('-')).toHaveLength(2);
});

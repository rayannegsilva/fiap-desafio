import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Text } from '../Text/Text';
import { Collapsible } from './Collapsible';

it('starts collapsed and toggles its content', async () => {
  await renderWithProviders(
    <Collapsible title="1º TRIMESTRE" variant="card">
      <Text>MATEMÁTICA I</Text>
    </Collapsible>,
  );
  const header = screen.getByRole('button', { name: '1º TRIMESTRE' });
  expect(header).toBeCollapsed();
  expect(screen.queryByText('MATEMÁTICA I')).toBeNull();
  await fireEvent.press(header);
  expect(header).toBeExpanded();
  expect(screen.getByText('MATEMÁTICA I')).toBeOnTheScreen();
  await fireEvent.press(header);
  expect(screen.queryByText('MATEMÁTICA I')).toBeNull();
});

it('can start expanded', async () => {
  await renderWithProviders(
    <Collapsible title="CIÊNCIAS" variant="row" defaultExpanded>
      <Text>Nota:</Text>
    </Collapsible>,
  );
  expect(screen.getByText('Nota:')).toBeOnTheScreen();
});

it('nests (trimester > subject)', async () => {
  await renderWithProviders(
    <Collapsible title="1º TRIMESTRE" variant="card">
      <Collapsible title="ARTE" variant="row">
        <Text>Faltas:</Text>
      </Collapsible>
    </Collapsible>,
  );
  await fireEvent.press(screen.getByRole('button', { name: '1º TRIMESTRE' }));
  await fireEvent.press(screen.getByRole('button', { name: 'ARTE' }));
  expect(screen.getByText('Faltas:')).toBeOnTheScreen();
});

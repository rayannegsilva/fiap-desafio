import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Dropdown } from './Dropdown';

const years = [
  { id: '2025', label: '7EF - 2025' },
  { id: '2024', label: '6EF - 2024' },
];

const setup = (onSelect = jest.fn()) =>
  renderWithProviders(
    <Dropdown
      options={years}
      selected={years[0]}
      onSelect={onSelect}
      getLabel={y => y.label}
      getKey={y => y.id}
      accessibilityLabel="Ano letivo"
    />,
  );

it('shows the selected option and keeps the list closed', async () => {
  await setup();
  const box = screen.getByRole('button', { name: 'Ano letivo' });
  expect(box).toBeCollapsed();
  expect(box).toHaveAccessibilityValue({ text: '7EF - 2025' });
  expect(screen.getAllByText('7EF - 2025')).toHaveLength(1);
  expect(screen.queryByText('6EF - 2024')).toBeNull();
});

it('opens, marks the selected option, selects and closes', async () => {
  const onSelect = jest.fn();
  await setup(onSelect);
  await fireEvent.press(screen.getByRole('button', { name: 'Ano letivo' }));
  expect(screen.getByRole('button', { name: 'Ano letivo' })).toBeExpanded();
  expect(screen.getByRole('button', { name: '7EF - 2025' })).toBeSelected();
  expect(screen.getByRole('button', { name: '6EF - 2024' })).not.toBeSelected();
  await fireEvent.press(screen.getByRole('button', { name: '6EF - 2024' }));
  expect(onSelect).toHaveBeenCalledWith(years[1]);
  expect(screen.queryByRole('button', { name: '6EF - 2024' })).toBeNull();
});

it('closes when the box is pressed again', async () => {
  await setup();
  const box = screen.getByRole('button', { name: 'Ano letivo' });
  await fireEvent.press(box);
  await fireEvent.press(box);
  expect(screen.queryByText('6EF - 2024')).toBeNull();
});

it('floats over following content instead of pushing it', async () => {
  await setup();
  await fireEvent.press(screen.getByRole('button', { name: 'Ano letivo' }));
  expect(screen.getByTestId('dropdown-panel')).toHaveStyle({
    position: 'absolute',
    top: 53,
    left: 0,
    right: 0,
  });
});

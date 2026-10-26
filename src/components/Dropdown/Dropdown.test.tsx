import { fireEvent, screen, waitFor } from '@testing-library/react-native';
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
  await waitFor(() => expect(onSelect).toHaveBeenCalledWith(years[1]));
  await waitFor(() =>
    expect(screen.queryByRole('button', { name: '6EF - 2024' })).toBeNull(),
  );
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

it('extends each option touch target to 44pt without changing its visuals', async () => {
  await setup();
  await fireEvent.press(screen.getByRole('button', { name: 'Ano letivo' }));
  const row = screen.getByRole('button', { name: '6EF - 2024' });
  expect(row.props.hitSlop).toEqual({ top: 4, bottom: 4 });
  expect(row.children[0]).toHaveStyle({ paddingVertical: 8 });
});

it('renders a static box when there is a single option', async () => {
  await renderWithProviders(
    <Dropdown
      options={[years[0]]}
      selected={years[0]}
      onSelect={jest.fn()}
      getLabel={y => y.label}
      getKey={y => y.id}
      accessibilityLabel="Ano letivo"
    />,
  );
  expect(screen.getByText('7EF - 2025')).toBeOnTheScreen();
  expect(screen.queryByRole('button', { name: 'Ano letivo' })).toBeNull();
});

it('slides an opaque panel in, fades it out on exit and fades its options', async () => {
  await setup();
  await fireEvent.press(screen.getByRole('button', { name: 'Ano letivo' }));
  const { entering, exiting } = screen.getByTestId('dropdown-panel').props;
  expect(entering.definitions[0]).toEqual({
    transform: [{ translateY: -8 }],
  });
  expect(entering.definitions[100]).toMatchObject({
    transform: [{ translateY: 0 }],
  });
  expect(exiting.definitions[100]).toMatchObject({
    opacity: 0,
    transform: [{ translateY: -8 }],
  });
  expect(entering.definitions[0]).not.toHaveProperty('opacity');
});

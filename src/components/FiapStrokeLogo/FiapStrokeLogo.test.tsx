import { render, screen } from '@testing-library/react-native';
import { useSharedValue } from 'react-native-reanimated';
import { CLIP_RECTS, FiapStrokeLogo, STROKES } from './FiapStrokeLogo';

type Props = { progress: number; color?: string };

function Probe({ progress, color = '#ED145B' }: Props) {
  const shared = useSharedValue(progress);
  return <FiapStrokeLogo progress={shared} color={color} width={306} />;
}

const offsets = () =>
  STROKES.map((_, index) => {
    const node = screen.getByTestId(`fiap-stroke-${index}`);
    return (node.props.strokeDashoffset ?? 0) as number;
  });

it('exposes the logo as an image labeled FIAP', async () => {
  await render(<Probe progress={0} />);
  expect(screen.getByRole('image', { name: 'FIAP' })).toBeOnTheScreen();
});

it('hides every stroke at progress 0', async () => {
  await render(<Probe progress={0} />);
  expect(offsets()).toEqual(STROKES.map(stroke => stroke.length));
});

it('shows every stroke at progress 1', async () => {
  await render(<Probe progress={1} />);
  expect(offsets()).toEqual(STROKES.map(() => 0));
});

it('draws letters in order', async () => {
  await render(<Probe progress={0.3} />);
  const [first] = offsets();
  const last = offsets()[STROKES.length - 1];
  expect(first).toBeLessThan(STROKES[0].length);
  expect(last).toBe(STROKES[STROKES.length - 1].length);
});

describe('CLIP_RECTS', () => {
  it('has no overlapping rectangles', () => {
    CLIP_RECTS.forEach((a, i) =>
      CLIP_RECTS.slice(i + 1).forEach(b => {
        const overlaps =
          a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2;
        expect(overlaps).toBe(false);
      }),
    );
  });
});

import { Svg, ClipPath, Defs, G, Path } from 'react-native-svg';
import Animated, {
  interpolate,
  useAnimatedProps,
  type SharedValue,
} from 'react-native-reanimated';
import { motion } from '../../theme/motion';

type Props = {
  progress: SharedValue<number>;
  color: SharedValue<string> | string;
  width: number;
};

type StrokeShape = {
  d: string;
  length: number;
  letter: number;
  from: number;
  to: number;
};

const VIEW_BOX = { width: 798, height: 216 };
const STROKE_WIDTH = 15.8;
const LETTER_COUNT = 4;
const CLIP_ID = 'fiap-clip';
const CLIP_PATH =
  'M0 0H420V214.506H0Z M420 0H585V120.39H420Z M500 159.546H600V214.504H500Z M585 0H798V216H585Z';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const STROKES: StrokeShape[] = [
  {
    d: 'M180.732 10.26H9.277V214.615',
    length: 375.81,
    letter: 0,
    from: 0,
    to: 0.83,
  },
  {
    d: 'M60.297 111.53H137.3',
    length: 77.003,
    letter: 0,
    from: 0.83,
    to: 1,
  },
  {
    d: 'M235.434 3.005V214.614',
    length: 211.609,
    letter: 1,
    from: 0,
    to: 1,
  },
  {
    d: 'M293.12 222L418.8 3.9L496.26 128.4',
    length: 398.35,
    letter: 2,
    from: 0,
    to: 0.84,
  },
  {
    d: 'M513.19 155.546L552.34 218.504',
    length: 74.14,
    letter: 2,
    from: 0.84,
    to: 1,
  },
  {
    d: 'M599.924 213.798V9.445H729.6A59.1 59.1 0 0 1 729.6 127.642H664.951',
    length: 584.35,
    letter: 3,
    from: 0,
    to: 1,
  },
];

const TOTAL =
  (LETTER_COUNT - 1) * motion.splash.letterStagger +
  motion.splash.letterDuration;

function windowOf(stroke: StrokeShape): [number, number] {
  const start = (stroke.letter * motion.splash.letterStagger) / TOTAL;
  const span = motion.splash.letterDuration / TOTAL;
  return [start + span * stroke.from, start + span * stroke.to];
}

type StrokeProps = { stroke: StrokeShape; index: number } & Pick<
  Props,
  'progress' | 'color'
>;

function Stroke({ stroke, index, progress, color }: StrokeProps) {
  const [start, end] = windowOf(stroke);
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset:
      stroke.length *
      (1 - interpolate(progress.value, [start, end], [0, 1], 'clamp')),
    stroke: typeof color === 'string' ? color : color.value,
  }));

  return (
    <AnimatedPath
      testID={`fiap-stroke-${index}`}
      d={stroke.d}
      fill="none"
      strokeWidth={STROKE_WIDTH}
      strokeLinejoin="bevel"
      strokeDasharray={stroke.length}
      animatedProps={animatedProps}
    />
  );
}

export function FiapStrokeLogo({ progress, color, width }: Props) {
  const height = (width * VIEW_BOX.height) / VIEW_BOX.width;

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
      accessible
      accessibilityRole="image"
      accessibilityLabel="FIAP"
    >
      <Defs>
        <ClipPath id={CLIP_ID}>
          <Path d={CLIP_PATH} />
        </ClipPath>
      </Defs>
      <G clipPath={`url(#${CLIP_ID})`}>
        {STROKES.map((stroke, index) => (
          <Stroke
            key={stroke.d}
            stroke={stroke}
            index={index}
            progress={progress}
            color={color}
          />
        ))}
      </G>
    </Svg>
  );
}

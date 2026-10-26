import Animated from 'react-native-reanimated';
import { useFocusEntrance } from '../../animations/useFocusEntrance';
import { Text } from '../../components/Text/Text';
import type { Lesson } from '../../data/types';
import { Box } from '../../theme/restyle';

const MARKER_SIZE = 6;
const MARKER_GAP = 10;

type Props = { lesson: Lesson; index: number };

export function LessonItem({ lesson, index }: Props) {
  const style = useFocusEntrance(index);

  return (
    <Animated.View style={style}>
      <Box flexDirection="row" alignItems="center" style={{ gap: MARKER_GAP }}>
        <Box
          width={MARKER_SIZE}
          height={MARKER_SIZE}
          borderWidth={1}
          borderColor="marker"
          style={{ borderRadius: MARKER_SIZE / 2 }}
        />
        <Text variant="caption">{lesson.horario}</Text>
      </Box>
      <Box marginTop="s" style={{ marginLeft: MARKER_SIZE + MARKER_GAP }}>
        <Text variant="bodyStrong">{lesson.disciplina}</Text>
      </Box>
    </Animated.View>
  );
}

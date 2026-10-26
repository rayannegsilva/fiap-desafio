import { StyleSheet } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';
import { Skeleton } from '../../components/Skeleton/Skeleton';
import { motion } from '../../theme/motion';
import { Box } from '../../theme/restyle';
import { useAppTheme } from '../../theme/useAppTheme';

const ROWS = [0, 1, 2, 3];
const LIST_SIDE_MARGIN = 40;
const TIME_WIDTH = 80;
const TIME_HEIGHT = 12;
const SUBJECT_WIDTH = 160;
const SUBJECT_HEIGHT = 16;

export function ScheduleSkeleton() {
  const theme = useAppTheme();

  return (
    <Animated.View
      accessible
      accessibilityLabel="Carregando aulas"
      exiting={FadeOut.duration(motion.duration.exit)}
      style={[
        styles.list,
        {
          paddingTop: theme.spacing.l,
          gap: theme.spacing.m,
        },
      ]}
    >
      {ROWS.map(row => (
        <Box key={row} gap="s">
          <Skeleton width={TIME_WIDTH} height={TIME_HEIGHT} />
          <Skeleton width={SUBJECT_WIDTH} height={SUBJECT_HEIGHT} />
        </Box>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: LIST_SIDE_MARGIN },
});

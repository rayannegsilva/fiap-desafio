import Animated, { FadeOut } from 'react-native-reanimated';
import { Skeleton } from '../../components/Skeleton/Skeleton';
import { motion } from '../../theme/motion';
import { useAppTheme } from '../../theme/useAppTheme';

const TERMS = [0, 1, 2];
const DROPDOWN_HEIGHT = 45;
const TERM_HEIGHT = 90;

export function ReportCardSkeleton() {
  const theme = useAppTheme();

  return (
    <Animated.View
      accessible
      accessibilityLabel="Carregando boletim"
      exiting={FadeOut.duration(motion.duration.exit)}
      style={{
        marginTop: theme.spacing.m,
        marginHorizontal: theme.spacing.m,
        paddingBottom: theme.spacing.m,
        gap: theme.spacing.m,
      }}
    >
      <Skeleton width="100%" height={DROPDOWN_HEIGHT} />
      {TERMS.map(term => (
        <Skeleton key={term} width="100%" height={TERM_HEIGHT} />
      ))}
    </Animated.View>
  );
}

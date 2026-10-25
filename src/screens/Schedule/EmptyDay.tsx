import { Image, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import noClasses from '../../assets/images/no-classes.png';
import { Text } from '../../components/Text/Text';
import { motion } from '../../theme/motion';

const EMPTY_GAP = 20;

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: EMPTY_GAP, gap: EMPTY_GAP },
  image: { width: '100%', maxWidth: 328, aspectRatio: 328 / 208 },
});

export function EmptyDay() {
  return (
    <Animated.View
      entering={FadeIn.duration(motion.duration.transition)}
      style={styles.container}
    >
      <Image source={noClasses} style={styles.image} accessible={false} />
      <Text variant="emptyState">Sem aulas neste dia</Text>
    </Animated.View>
  );
}

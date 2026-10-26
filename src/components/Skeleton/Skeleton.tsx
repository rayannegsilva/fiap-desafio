import { useEffect } from 'react';
import { StyleSheet, type DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { motion } from '../../theme/motion';
import { useAppTheme } from '../../theme/useAppTheme';
import type { Theme } from '../../theme/theme';

const PULSE_DURATION = 800;
const OPACITY_LOW = 0.4;
const OPACITY_HIGH = 0.8;
const OPACITY_STATIC = 0.6;

type Props = {
  width: DimensionValue;
  height: number;
  radius?: keyof Theme['borderRadii'];
  testID?: string;
};

export function Skeleton({ width, height, radius = 'default', testID }: Props) {
  const theme = useAppTheme();
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(OPACITY_LOW);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    opacity.value = withRepeat(
      withTiming(OPACITY_HIGH, {
        duration: PULSE_DURATION,
        easing: motion.easing.enter,
      }),
      -1,
      true,
    );
  }, [reduceMotion, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion ? OPACITY_STATIC : opacity.value,
  }));

  return (
    <Animated.View
      accessible={false}
      testID={testID}
      style={[
        styles.block,
        {
          width,
          height,
          borderRadius: theme.borderRadii[radius],
          backgroundColor: theme.colors.surfaceRaised,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  block: {},
});

import { useEffect } from 'react';
import {
  Easing,
  type EasingFunction,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { motion } from '../theme/motion';

type Options = { duration?: number; easing?: EasingFunction };

export function useChevronRotation(
  expanded: boolean,
  {
    duration = motion.duration.micro,
    easing = Easing.inOut(Easing.quad),
  }: Options = {},
) {
  const reduceMotion = useReducedMotion();
  const rotation = useSharedValue(expanded ? 180 : 0);

  useEffect(() => {
    const target = expanded ? 180 : 0;
    rotation.value = reduceMotion
      ? target
      : withTiming(target, { duration, easing });
  }, [expanded, reduceMotion, rotation, duration, easing]);

  return useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
}

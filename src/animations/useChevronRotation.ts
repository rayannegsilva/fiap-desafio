import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { motion } from '../theme/motion';

export function useChevronRotation(expanded: boolean) {
  const reduceMotion = useReducedMotion();
  const rotation = useSharedValue(expanded ? 180 : 0);

  useEffect(() => {
    const target = expanded ? 180 : 0;
    rotation.value = reduceMotion
      ? target
      : withTiming(target, { duration: motion.duration.micro });
  }, [expanded, reduceMotion, rotation]);

  return useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
}

import { NavigationContext } from '@react-navigation/native';
import { useContext, useEffect } from 'react';
import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { motion } from '../theme/motion';

const TRAVEL = 16;

export function useFocusEntrance(index: number) {
  const reduceMotion = useReducedMotion();
  const navigation = useContext(NavigationContext);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    const play = () => {
      progress.value = 0;
      progress.value = withDelay(
        index * motion.stagger,
        withTiming(1, { duration: motion.duration.transition }),
      );
    };
    if (!navigation || navigation.isFocused()) {
      play();
    }
    return navigation?.addListener('focus', play);
  }, [navigation, index, reduceMotion, progress]);

  return useAnimatedStyle(() => {
    if (reduceMotion) {
      return { opacity: 1 };
    }
    return {
      opacity: progress.value,
      transform: [{ translateY: (1 - progress.value) * TRAVEL }],
    };
  });
}

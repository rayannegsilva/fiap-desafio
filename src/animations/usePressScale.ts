import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { motion } from '../theme/motion';

export function usePressScale() {
  const reduceMotion = useReducedMotion();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    if (reduceMotion) {
      return {
        opacity: withTiming(pressed.value ? motion.pressedOpacity : 1, {
          duration: motion.duration.micro,
        }),
        transform: [{ scale: 1 }],
      };
    }
    return {
      transform: [
        {
          scale: withSpring(
            pressed.value ? motion.pressScale : 1,
            motion.spring,
          ),
        },
      ],
    };
  });

  return {
    animatedStyle,
    onPressIn: () => {
      pressed.value = 1;
    },
    onPressOut: () => {
      pressed.value = 0;
    },
  };
}

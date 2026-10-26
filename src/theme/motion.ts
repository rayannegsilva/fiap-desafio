import { Easing } from 'react-native-reanimated';

export const motion = {
  pressScale: 0.96,
  pressedOpacity: 0.7,
  spring: { damping: 15, stiffness: 300 },
  duration: { micro: 150, transition: 300, exit: 200, skeleton: 300 },
  easing: { enter: Easing.out(Easing.cubic), exit: Easing.in(Easing.quad) },
  stagger: 40,
  splash: {
    letterDuration: 700,
    letterStagger: 250,
    hold: 150,
    travel: 600,
    handoff: 150,
    fadeOut: 250,
  },
} as const;

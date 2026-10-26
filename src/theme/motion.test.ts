import { motion } from './motion';

it('keeps the splash Login path within the 2.7 s target', () => {
  const { letterStagger, letterDuration, hold, travel, handoff, fadeOut } =
    motion.splash;
  const total =
    3 * letterStagger + letterDuration + hold + travel + handoff + fadeOut;
  expect(total).toBeLessThanOrEqual(2700);
});

it('exits faster than it enters', () => {
  expect(motion.duration.exit).toBeLessThan(motion.duration.transition);
});

it('defines enter and exit easing curves', () => {
  expect(typeof motion.easing.enter).toBe('function');
  expect(typeof motion.easing.exit).toBe('function');
  expect(motion.easing.enter(0.5)).not.toBe(motion.easing.exit(0.5));
});

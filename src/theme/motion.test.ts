import { motion } from './motion';

it('keeps the splash Login path within the 2.7 s target', () => {
  const { letterStagger, letterDuration, hold, travel, handoff, fadeOut } =
    motion.splash;
  const total =
    3 * letterStagger + letterDuration + hold + travel + handoff + fadeOut;
  expect(total).toBeLessThanOrEqual(2700);
});

import { useEffect, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import logo from '../../assets/images/logo.png';
import { LOGO_SIZE, LOGO_TOP } from '../../screens/Login/loginLayout';
import { useSessionHydrated } from '../../store/useSession';
import { useSessionStore } from '../../store/useSessionStore';
import { motion } from '../../theme/motion';
import { useAppTheme } from '../../theme/useAppTheme';
import { FiapStrokeLogo } from '../FiapStrokeLogo/FiapStrokeLogo';

type Props = {
  onFinish: () => void;
};

const SVG_ASPECT = 216 / 798;
const FIAP_IN_PNG_WIDTH = 149 / 250;
const LOGO_END_SCALE = FIAP_IN_PNG_WIDTH;
const DRAWING_DURATION =
  3 * motion.splash.letterStagger + motion.splash.letterDuration;

export function SplashOverlay({ onFinish }: Props) {
  const theme = useAppTheme();
  const reduceMotion = useReducedMotion();
  const hydrated = useSessionHydrated();
  const signedIn = useSessionStore(s => s.guardianId !== null);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [drawn, setDrawn] = useState(reduceMotion);
  const [handedOff, setHandedOff] = useState(false);
  const leaving = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const progress = useSharedValue(reduceMotion ? 1 : 0);
  const travelProgress = useSharedValue(0);
  const backgroundOpacity = useSharedValue(1);
  const logoOpacity = useSharedValue(reduceMotion ? 0 : 1);
  const pngOpacity = useSharedValue(0);

  const logoHeight = LOGO_SIZE.width * SVG_ASPECT;
  const startTop = (screenHeight - logoHeight) / 2;
  const left = (screenWidth - LOGO_SIZE.width) / 2;

  const color = useDerivedValue(() =>
    interpolateColor(
      travelProgress.value,
      [0, 1],
      [theme.colors.brand, theme.colors.accentText],
    ),
  );

  useEffect(() => {
    if (reduceMotion) {
      logoOpacity.value = withTiming(1, {
        duration: motion.duration.transition,
      });
      return;
    }
    progress.value = withTiming(1, {
      duration: DRAWING_DURATION,
      easing: Easing.linear,
    });
    const timer = setTimeout(() => setDrawn(true), DRAWING_DURATION);
    return () => clearTimeout(timer);
  }, [reduceMotion, progress, logoOpacity]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!drawn || !hydrated || leaving.current) {
      return;
    }
    leaving.current = true;
    const { hold, travel, handoff, fadeOut } = motion.splash;
    const fade = { duration: fadeOut, easing: Easing.out(Easing.quad) };
    const later = (ms: number, run: () => void) => {
      timers.current.push(setTimeout(run, ms));
    };

    const fadeAll = () => {
      backgroundOpacity.value = withTiming(0, fade);
      logoOpacity.value = withTiming(0, fade);
      later(fadeOut, onFinish);
    };

    if (reduceMotion || signedIn) {
      later(reduceMotion ? 0 : hold, fadeAll);
    } else {
      later(hold, () => {
        travelProgress.value = withTiming(1, {
          duration: travel,
          easing: Easing.inOut(Easing.cubic),
        });
      });
      later(hold + travel, () => {
        setHandedOff(true);
        pngOpacity.value = withTiming(1, { duration: handoff });
        logoOpacity.value = withTiming(0, { duration: handoff });
      });
      later(hold + travel + handoff, () => {
        backgroundOpacity.value = withTiming(0, fade);
        later(fadeOut, onFinish);
      });
    }
  }, [
    drawn,
    hydrated,
    signedIn,
    reduceMotion,
    onFinish,
    backgroundOpacity,
    logoOpacity,
    pngOpacity,
    travelProgress,
  ]);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { translateY: travelProgress.value * (LOGO_TOP - startTop) },
      { scale: 1 - travelProgress.value * (1 - LOGO_END_SCALE) },
    ],
  }));
  const pngStyle = useAnimatedStyle(() => ({ opacity: pngOpacity.value }));

  return (
    <Animated.View
      testID="splash-overlay"
      pointerEvents="auto"
      style={styles.overlay}
    >
      <Animated.View
        style={[
          styles.overlay,
          { backgroundColor: theme.colors.background },
          backgroundStyle,
        ]}
      />
      <Animated.View style={[styles.logo, { left, top: startTop }, logoStyle]}>
        <FiapStrokeLogo
          progress={progress}
          color={color}
          width={LOGO_SIZE.width}
        />
      </Animated.View>
      {handedOff ? (
        <Animated.Image
          source={logo}
          resizeMode="contain"
          accessible
          accessibilityRole="image"
          accessibilityLabel="FIAP School"
          style={[styles.png, { left, top: LOGO_TOP }, pngStyle]}
        />
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: StyleSheet.absoluteFill,
  logo: { position: 'absolute', transformOrigin: 'top left' },
  png: { position: 'absolute', ...LOGO_SIZE },
});

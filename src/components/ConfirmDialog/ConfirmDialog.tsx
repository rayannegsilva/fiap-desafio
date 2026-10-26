import { useEffect, useRef, useState, type FC } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  FadeIn,
  Keyframe,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { SvgProps } from 'react-native-svg';
import { motion } from '../../theme/motion';
import { Box } from '../../theme/restyle';
import { Text } from '../Text/Text';
import { TextButton } from '../TextButton/TextButton';

const BACKDROP = 'rgba(0, 0, 0, 0.6)';

const cardEntering = new Keyframe({
  0: { opacity: 0, transform: [{ scale: motion.pressScale }] },
  100: { opacity: 1, transform: [{ scale: 1 }] },
}).duration(motion.duration.transition);

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClosed?: () => void;
  confirmIcon?: FC<SvgProps>;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  onClosed,
  confirmIcon,
}: Props) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(visible);
  const presence = useSharedValue(1);
  const onClosedRef = useRef(onClosed);

  useEffect(() => {
    onClosedRef.current = onClosed;
  });

  useEffect(() => {
    if (visible) {
      setMounted(true);
      cancelAnimation(presence);
      presence.value = withTiming(1, { duration: motion.duration.micro });
      return;
    }
    if (!mounted) return;
    const finish = () => {
      setMounted(false);
      presence.value = 1;
      onClosedRef.current?.();
    };
    if (reduceMotion) {
      finish();
      return;
    }
    presence.value = withTiming(
      0,
      { duration: motion.duration.exit, easing: motion.easing.exit },
      finished => {
        'worklet';
        if (finished) scheduleOnRN(finish);
      },
    );
  }, [visible, mounted, reduceMotion, presence]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: presence.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: presence.value,
    transform: [
      { scale: motion.pressScale + (1 - motion.pressScale) * presence.value },
    ],
  }));

  if (!visible && !mounted) {
    return null;
  }

  return (
    <Modal
      testID="confirm-dialog"
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Box flex={1} justifyContent="center">
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Animated.View
            style={styles.fill}
            entering={FadeIn.duration(motion.duration.micro)}
          >
            <Pressable
              testID="confirm-dialog-backdrop"
              style={styles.fill}
              accessible={false}
              importantForAccessibility="no"
              onPress={onCancel}
            />
          </Animated.View>
        </Animated.View>
        <Animated.View style={cardStyle}>
          <Animated.View entering={cardEntering}>
            <Box
              backgroundColor="surfaceRaised"
              borderRadius="default"
              padding="l"
              marginHorizontal="l"
              accessibilityViewIsModal
            >
              <Text variant="sectionTitle" accessibilityRole="header">
                {title}
              </Text>
              <Text variant="body" marginTop="m">
                {message}
              </Text>
              <Box
                flexDirection="row"
                justifyContent="flex-end"
                marginTop="l"
                gap="l"
              >
                <TextButton
                  variant="cardTitle"
                  color="textPrimary"
                  label={cancelLabel}
                  onPress={onCancel}
                />
                <TextButton
                  variant="cardTitle"
                  label={confirmLabel}
                  icon={confirmIcon}
                  onPress={onConfirm}
                />
              </Box>
            </Box>
          </Animated.View>
        </Animated.View>
      </Box>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: BACKDROP,
  },
  fill: StyleSheet.absoluteFill,
});

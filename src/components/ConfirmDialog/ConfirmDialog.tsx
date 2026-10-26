import type { FC } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, Keyframe } from 'react-native-reanimated';
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
  confirmIcon,
}: Props) {
  if (!visible) {
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
        <Animated.View
          style={styles.backdrop}
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

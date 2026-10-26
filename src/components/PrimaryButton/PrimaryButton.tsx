import { ActivityIndicator, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { usePressScale } from '../../animations/usePressScale';
import { motion } from '../../theme/motion';
import { Box } from '../../theme/restyle';
import { useAppTheme } from '../../theme/useAppTheme';
import { Text } from '../Text/Text';

const BUTTON_HEIGHT = 60;

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
}: Props) {
  const theme = useAppTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={animatedStyle}>
        <Box
          height={BUTTON_HEIGHT}
          backgroundColor="accent"
          alignItems="center"
          justifyContent="center"
        >
          <Animated.View
            key={loading ? 'loading' : 'label'}
            testID="primary-button-content"
            entering={FadeIn.duration(motion.duration.micro)}
            exiting={FadeOut.duration(motion.duration.micro)}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.onAccent} />
            ) : (
              <Text
                variant="button"
                color={disabled ? 'textDisabled' : 'onAccent'}
              >
                {label}
              </Text>
            )}
          </Animated.View>
        </Box>
      </Animated.View>
    </Pressable>
  );
}

import { ActivityIndicator, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { usePressScale } from '../../animations/usePressScale';
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
        </Box>
      </Animated.View>
    </Pressable>
  );
}

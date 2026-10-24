import { useEffect } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { motion } from '../../theme/motion';
import { Box } from '../../theme/restyle';
import { useAppTheme } from '../../theme/useAppTheme';
import { Text } from '../Text/Text';

const SHAKE_OFFSETS = [-8, 8, -6, 6, 0];
const SHAKE_STEP = motion.duration.micro / 3;

const styles = StyleSheet.create({ input: { textAlign: 'center' } });

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function TextField({ label, error, style, ...rest }: Props) {
  const theme = useAppTheme();
  const reduceMotion = useReducedMotion();
  const shake = useSharedValue(0);
  const filled = Boolean(rest.value);
  const inputVariant = theme.textVariants.inputValue;

  useEffect(() => {
    if (error && !reduceMotion) {
      shake.value = withSequence(
        ...SHAKE_OFFSETS.map(x => withTiming(x, { duration: SHAKE_STEP })),
      );
    }
  }, [error, reduceMotion, shake]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  return (
    <Animated.View testID="text-field-container" style={animatedStyle}>
      <Text variant="label">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.colors.textDisabled}
        style={[
          {
            fontFamily: inputVariant.fontFamily,
            fontSize: inputVariant.fontSize,
            lineHeight: inputVariant.lineHeight,
            color: theme.colors[inputVariant.color],
          },
          styles.input,
          style,
        ]}
        {...rest}
      />
      <Box
        testID="text-field-underline"
        height={1}
        backgroundColor={filled ? 'lineActive' : 'lineIdle'}
      />
      {error ? (
        <Text variant="error" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </Animated.View>
  );
}

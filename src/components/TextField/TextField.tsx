import { useEffect, type ComponentRef, type Ref } from 'react';
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

const ERROR_TOP = 32;

const styles = StyleSheet.create({
  input: { textAlign: 'center' },
  error: { marginTop: ERROR_TOP, textAlign: 'center' },
});

type Props = TextInputProps & {
  label: string;
  error?: string;
  ref?: Ref<ComponentRef<typeof TextInput>>;
};

export function TextField({ label, error, style, ref, ...rest }: Props) {
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
      <Text variant="label" textAlign="center">
        {label}
      </Text>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        placeholderTextColor={theme.colors.textDisabled}
        cursorColor={theme.colors.accentText}
        selectionColor={theme.colors.accentText}
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
        <Text
          variant="error"
          style={styles.error}
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : null}
    </Animated.View>
  );
}

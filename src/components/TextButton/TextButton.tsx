import type { FC } from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import type { SvgProps } from 'react-native-svg';
import { usePressScale } from '../../animations/usePressScale';
import { Box } from '../../theme/restyle';
import { useAppTheme } from '../../theme/useAppTheme';
import { Text } from '../Text/Text';

const HIT_SLOP = { top: 15, bottom: 15, left: 12, right: 12 };
const DEFAULT_ICON_SIZE = 24;

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'caption' | 'cardTitle';
  icon?: FC<SvgProps>;
  iconSize?: number;
};

export function TextButton({
  label,
  onPress,
  variant = 'caption',
  icon: Icon,
  iconSize = DEFAULT_ICON_SIZE,
}: Props) {
  const theme = useAppTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const color = theme.colors[theme.textVariants[variant].color];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={animatedStyle}>
        <Box flexDirection="row" alignItems="center" gap="xs">
          {Icon ? (
            <Icon
              testID="text-button-icon"
              color={color}
              width={iconSize}
              height={iconSize}
            />
          ) : null}
          <Text variant={variant}>{label}</Text>
        </Box>
      </Animated.View>
    </Pressable>
  );
}

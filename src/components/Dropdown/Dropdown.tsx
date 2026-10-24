import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useChevronRotation } from '../../animations/useChevronRotation';
import ChevronDown from '../../assets/icons/chevron-down.svg';
import { motion } from '../../theme/motion';
import { Box } from '../../theme/restyle';
import { useAppTheme } from '../../theme/useAppTheme';
import { Text } from '../Text/Text';

const BOX_HEIGHT = 45;
const OPTION_HIT_SLOP = { top: 4, bottom: 4 };
const CHEVRON_SIZE = 14;
const PANEL_Z_INDEX = 10;

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: PANEL_Z_INDEX,
    elevation: PANEL_Z_INDEX,
  },
});

type Props<T> = {
  options: T[];
  selected: T;
  onSelect: (option: T) => void;
  getLabel: (option: T) => string;
  getKey: (option: T) => string;
  accessibilityLabel: string;
};

export function Dropdown<T>({
  options,
  selected,
  onSelect,
  getLabel,
  getKey,
  accessibilityLabel,
}: Props<T>) {
  const theme = useAppTheme();
  const [open, setOpen] = useState(false);
  const chevronStyle = useChevronRotation(open);
  const selectedKey = getKey(selected);

  return (
    <Box zIndex={PANEL_Z_INDEX}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ text: getLabel(selected) }}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(value => !value)}
      >
        <Box
          flexDirection="row"
          alignItems="center"
          gap="s"
          height={BOX_HEIGHT}
          backgroundColor="surface"
          borderRadius="default"
          paddingHorizontal="sm"
        >
          <Text flex={1}>{getLabel(selected)}</Text>
          <Animated.View style={chevronStyle}>
            <ChevronDown
              width={CHEVRON_SIZE}
              height={CHEVRON_SIZE}
              color={theme.colors.accentText}
            />
          </Animated.View>
        </Box>
      </Pressable>
      {open ? (
        <Animated.View
          testID="dropdown-panel"
          entering={FadeIn.duration(motion.duration.micro)}
          exiting={FadeOut.duration(motion.duration.micro)}
          style={[
            styles.panel,
            {
              top: BOX_HEIGHT + theme.spacing.s,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadii.default,
              paddingVertical: theme.spacing.s,
            },
          ]}
        >
          {options.map(option => {
            const key = getKey(option);
            return (
              <Pressable
                key={key}
                accessibilityRole="button"
                hitSlop={OPTION_HIT_SLOP}
                accessibilityLabel={getLabel(option)}
                accessibilityState={{ selected: key === selectedKey }}
                onPress={() => {
                  onSelect(option);
                  setOpen(false);
                }}
              >
                <Box paddingVertical="s" paddingHorizontal="m">
                  <Text>{getLabel(option)}</Text>
                </Box>
              </Pressable>
            );
          })}
        </Animated.View>
      ) : null}
    </Box>
  );
}

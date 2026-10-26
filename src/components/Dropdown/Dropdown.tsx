import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  Keyframe,
  useReducedMotion,
} from 'react-native-reanimated';
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
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const selectTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const chevronStyle = useChevronRotation(open);
  const panelMotion = useMemo(() => {
    const hidden = { transform: [{ translateY: -theme.spacing.s }] };
    const shown = { transform: [{ translateY: 0 }] };
    return {
      entering: new Keyframe({
        0: hidden,
        100: { ...shown, easing: motion.easing.enter },
      }).duration(motion.duration.micro),
      exiting: new Keyframe({
        0: { ...shown, opacity: 1 },
        100: { ...hidden, opacity: 0, easing: motion.easing.exit },
      }).duration(motion.duration.exit),
      contentEntering: FadeIn.duration(motion.duration.micro).easing(
        motion.easing.enter,
      ),
      contentExiting: FadeOut.duration(motion.duration.exit).easing(
        motion.easing.exit,
      ),
    };
  }, [theme.spacing.s]);
  const selectedKey = getKey(selected);

  useEffect(() => () => clearTimeout(selectTimer.current), []);

  const choose = (option: T) => {
    setOpen(false);
    clearTimeout(selectTimer.current);
    selectTimer.current = setTimeout(
      () => onSelect(option),
      reduceMotion ? 0 : motion.duration.exit,
    );
  };

  const isStatic = options.length < 2;
  const field = (
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
      {isStatic ? null : (
        <Animated.View style={chevronStyle}>
          <ChevronDown
            width={CHEVRON_SIZE}
            height={CHEVRON_SIZE}
            color={theme.colors.accentText}
          />
        </Animated.View>
      )}
    </Box>
  );

  if (isStatic) return field;

  return (
    <Box zIndex={PANEL_Z_INDEX}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ text: getLabel(selected) }}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(value => !value)}
      >
        {field}
      </Pressable>
      {open ? (
        <Animated.View
          testID="dropdown-panel"
          entering={panelMotion.entering}
          exiting={panelMotion.exiting}
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
          <Animated.View
            entering={panelMotion.contentEntering}
            exiting={panelMotion.contentExiting}
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
                  onPress={() => choose(option)}
                >
                  <Box paddingVertical="s" paddingHorizontal="m">
                    <Text>{getLabel(option)}</Text>
                  </Box>
                </Pressable>
              );
            })}
          </Animated.View>
        </Animated.View>
      ) : null}
    </Box>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: PANEL_Z_INDEX,
    elevation: PANEL_Z_INDEX,
  },
});

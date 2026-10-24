import { useState, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, {
  Easing,
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnUI } from 'react-native-worklets';
import { useChevronRotation } from '../../animations/useChevronRotation';
import ChevronDown from '../../assets/icons/chevron-down.svg';
import { motion } from '../../theme/motion';
import { Box } from '../../theme/restyle';
import { useAppTheme } from '../../theme/useAppTheme';
import { Text } from '../Text/Text';

const CHEVRON_SIZE = 14;
const CARD_HEIGHT = 90;
const OPEN_EASING = Easing.out(Easing.cubic);
const CLOSE_EASING = Easing.in(Easing.cubic);

const styles = StyleSheet.create({
  body: { overflow: 'hidden' },
});

type Props = {
  title: string;
  variant: 'card' | 'row';
  children: ReactNode;
  defaultExpanded?: boolean;
};

export function Collapsible({
  title,
  variant,
  children,
  defaultExpanded = false,
}: Props) {
  const theme = useAppTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const easing = expanded ? OPEN_EASING : CLOSE_EASING;
  const chevronStyle = useChevronRotation(expanded, {
    duration: motion.duration.transition,
    easing,
  });
  const reduceMotion = useReducedMotion();
  const bodyRef = useAnimatedRef<Animated.View>();
  const contentRef = useAnimatedRef<Animated.View>();
  const expandedFlag = useSharedValue(defaultExpanded ? 1 : 0);
  const measured = useSharedValue(0);
  const height = useSharedValue(0);
  const isSettled = useSharedValue(defaultExpanded ? 1 : 0);

  const bodyStyle = useAnimatedStyle(() => ({
    height: isSettled.value ? 'auto' : height.value,
  }));

  const contentStyle = useAnimatedStyle(() =>
    isSettled.value
      ? { position: 'relative' }
      : { position: 'absolute', left: 0, right: 0, top: 0 },
  );

  const open = () => {
    'worklet';
    if (reduceMotion) {
      isSettled.value = 1;
      return;
    }
    const target = measure(contentRef)?.height || measured.value;
    height.value = withTiming(
      target,
      { duration: motion.duration.transition, easing: OPEN_EASING },
      finished => {
        'worklet';
        if (finished && expandedFlag.value) isSettled.value = 1;
      },
    );
  };

  const close = () => {
    'worklet';
    const current = measure(bodyRef)?.height ?? measured.value;
    height.value = current;
    isSettled.value = 0;
    height.value = reduceMotion
      ? 0
      : withTiming(0, {
          duration: motion.duration.transition,
          easing: CLOSE_EASING,
        });
  };

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    expandedFlag.value = next ? 1 : 0;
    scheduleOnUI(next ? open : close);
  };

  const onContentLayout = (event: LayoutChangeEvent) => {
    measured.value = event.nativeEvent.layout.height;
  };
  const isCard = variant === 'card';

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded }}
        onPress={toggle}
      >
        <Box
          flexDirection="row"
          alignItems="center"
          gap="s"
          {...(isCard
            ? {
                backgroundColor: 'surfaceRaised',
                borderRadius: 'default',
                height: CARD_HEIGHT,
                paddingHorizontal: 'm',
              }
            : { paddingVertical: 's' })}
        >
          <Text variant={isCard ? 'cardTitle' : 'captionMedium'} flex={1}>
            {title}
          </Text>
          <Animated.View style={chevronStyle}>
            <ChevronDown
              width={CHEVRON_SIZE}
              height={CHEVRON_SIZE}
              color={theme.colors.accentText}
            />
          </Animated.View>
        </Box>
      </Pressable>
      <Animated.View
        ref={bodyRef}
        style={[styles.body, bodyStyle]}
        aria-hidden={!expanded}
        accessibilityElementsHidden={!expanded}
        importantForAccessibility={expanded ? 'auto' : 'no-hide-descendants'}
      >
        <Animated.View
          ref={contentRef}
          style={contentStyle}
          onLayout={onContentLayout}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

import { useState, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, {
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
const ROW_HEIGHT = 37;
const CLOSE_FADE_RATIO = 0.4;
const ROW_HIT_SLOP = { top: 4, bottom: 4 };

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
  const chevronStyle = useChevronRotation(expanded, {
    duration: motion.duration.transition,
    easing: motion.easing.enter,
  });
  const reduceMotion = useReducedMotion();
  const bodyRef = useAnimatedRef<Animated.View>();
  const contentRef = useAnimatedRef<Animated.View>();
  const expandedFlag = useSharedValue(defaultExpanded ? 1 : 0);
  const measured = useSharedValue(0);
  const height = useSharedValue(0);
  const contentOpacity = useSharedValue(defaultExpanded ? 1 : 0);
  const isSettled = useSharedValue(defaultExpanded ? 1 : 0);

  const bodyStyle = useAnimatedStyle(() => ({
    height: isSettled.value ? 'auto' : height.value,
  }));

  const contentStyle = useAnimatedStyle(() => {
    if (isSettled.value) return { position: 'relative', opacity: 1 };
    return {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      opacity: contentOpacity.value,
    };
  });

  const open = () => {
    'worklet';
    if (reduceMotion) {
      isSettled.value = 1;
      contentOpacity.value = 1;
      return;
    }
    contentOpacity.value = withTiming(1, {
      duration: motion.duration.transition,
      easing: motion.easing.enter,
    });
    const target = measure(contentRef)?.height || measured.value;
    height.value = withTiming(
      target,
      { duration: motion.duration.transition, easing: motion.easing.enter },
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
    contentOpacity.value = reduceMotion
      ? 0
      : withTiming(0, {
          duration: motion.duration.transition * CLOSE_FADE_RATIO,
          easing: motion.easing.enter,
        });
    height.value = reduceMotion
      ? 0
      : withTiming(0, {
          duration: motion.duration.transition,
          easing: motion.easing.enter,
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
  const cardContent = {
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.s,
  };
  const rowContent = { gap: theme.spacing.xs, paddingBottom: theme.spacing.s };

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded }}
        onPress={toggle}
        hitSlop={isCard ? undefined : ROW_HIT_SLOP}
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
                paddingHorizontal: 'sm',
              }
            : { height: ROW_HEIGHT })}
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
          style={[isCard ? cardContent : rowContent, contentStyle]}
          onLayout={onContentLayout}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { overflow: 'hidden' },
});

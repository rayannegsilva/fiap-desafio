import { useState, type ReactNode } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { useChevronRotation } from '../../animations/useChevronRotation';
import ChevronDown from '../../assets/icons/chevron-down.svg';
import { motion } from '../../theme/motion';
import { Box } from '../../theme/restyle';
import { useAppTheme } from '../../theme/useAppTheme';
import { Text } from '../Text/Text';

const CHEVRON_SIZE = 14;
const CARD_HEIGHT = 90;

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
  const chevronStyle = useChevronRotation(expanded);
  const isCard = variant === 'card';

  return (
    <Animated.View layout={LinearTransition}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded }}
        onPress={() => setExpanded(value => !value)}
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
      {expanded ? (
        <Animated.View
          entering={FadeIn.duration(motion.duration.transition)}
          exiting={FadeOut.duration(motion.duration.transition)}
          layout={LinearTransition}
        >
          {children}
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

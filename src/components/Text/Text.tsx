import type { ComponentProps } from 'react';
import { Text as RestyleText } from '../../theme/restyle';

const MAX_FONT_SIZE_MULTIPLIER = 1.3;

type Props = ComponentProps<typeof RestyleText>;

export function Text({
  variant = 'body',
  maxFontSizeMultiplier = MAX_FONT_SIZE_MULTIPLIER,
  // Android measures custom-font text narrower than it draws, wrapping the
  // last word into a clipped line; 'simple' avoids it. No effect on iOS.
  textBreakStrategy = 'simple',
  ...rest
}: Props) {
  return (
    <RestyleText
      variant={variant}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      textBreakStrategy={textBreakStrategy}
      {...rest}
    />
  );
}

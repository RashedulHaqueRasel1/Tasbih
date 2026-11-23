import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AppText } from '@/shared/ui';

type CountHintProps = {
  text: string;
  visible: boolean;
};

/** A small tip that fades away once it is no longer needed. It keeps its space so nothing jumps. */
export function CountHint({ text, visible }: CountHintProps) {
  const opacity = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 350 });
  }, [visible, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={style}>
      <AppText variant="caption" color="textSecondary">
        {text}
      </AppText>
    </Animated.View>
  );
}

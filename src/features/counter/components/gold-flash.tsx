import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/shared/theme';

type GoldFlashProps = {
  /** Changes every time the flash should play. 0 means never. */
  trigger: number;
};

/** A brief wash of gold over the whole screen, for milestones. It never blocks touches. */
export function GoldFlash({ trigger }: GoldFlashProps) {
  const theme = useTheme();
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (trigger > 0) {
      opacity.value = withSequence(
        withTiming(0.14, { duration: 200 }),
        withTiming(0, { duration: 600 }),
      );
    }
  }, [trigger, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { backgroundColor: theme.gold }, style]}
    />
  );
}

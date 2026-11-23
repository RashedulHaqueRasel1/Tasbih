import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/shared/theme';

const SIZE = 120;

export type RippleSpot = { id: number; x: number; y: number };

type TapRippleProps = RippleSpot & { onDone: (id: number) => void };

/** A soft ring that grows and fades from the spot that was tapped. */
export function TapRipple({ id, x, y, onDone }: TapRippleProps) {
  const theme = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) }, (done) => {
      if (done) {
        runOnJS(onDone)(id);
      }
    });
  }, [id, onDone, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.2 * (1 - progress.value),
    transform: [{ scale: 0.4 + progress.value * 0.8 }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.ring,
        { left: x - SIZE / 2, top: y - SIZE / 2, borderColor: theme.accent },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
  },
});

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/shared/theme';

const BEADS = 33;

type BeadRingProps = {
  size: number;
  children?: React.ReactNode;
};

/** A slowly turning ring of 33 beads with a gold imam bead. Children sit still in the middle. */
export function BeadRing({ size, children }: BeadRingProps) {
  const theme = useTheme();
  const turn = useSharedValue(0);

  useEffect(() => {
    turn.value = withRepeat(withTiming(360, { duration: 90_000, easing: Easing.linear }), -1);
    return () => cancelAnimation(turn);
  }, [turn]);

  const spin = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.value}deg` }] }));

  const center = size / 2;
  const ringRadius = size / 2 - 16;

  return (
    <View style={{ width: size, height: size }}>
      <Animated.View style={[StyleSheet.absoluteFill, spin]}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={ringRadius}
            stroke={theme.surfaceSelected}
            strokeWidth={2}
            fill="none"
          />
          {Array.from({ length: BEADS }, (_, index) => {
            const angle = (index / BEADS) * Math.PI * 2 - Math.PI / 2;
            const imam = index === 0;
            return (
              <Circle
                key={index}
                cx={center + ringRadius * Math.cos(angle)}
                cy={center + ringRadius * Math.sin(angle)}
                r={imam ? 11 : 7.5}
                fill={imam ? theme.gold : theme.accent}
                opacity={imam ? 1 : 0.45 + 0.55 * (index / BEADS)}
              />
            );
          })}
        </Svg>
      </Animated.View>
      <View style={styles.center}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
});

import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { spacing, useTheme } from '@/shared/theme';

import { AppName } from './app-name';

const BEADS = 33;
const RING = 220;
const RADIUS = RING / 2 - 14;
const STAGGER = 32;
const HOLD_MS = 2100;

type IntroSplashProps = {
  onDone: () => void;
};

function Bead({ index }: { index: number }) {
  const theme = useTheme();
  const imam = index === 0;
  const size = imam ? 20 : 14;
  const angle = (index / BEADS) * Math.PI * 2 - Math.PI / 2;

  return (
    <Animated.View
      entering={ZoomIn.delay(250 + index * STAGGER)
        .duration(380)
        .easing(Easing.out(Easing.back(1.8)))}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        left: RING / 2 + RADIUS * Math.cos(angle) - size / 2,
        top: RING / 2 + RADIUS * Math.sin(angle) - size / 2,
        backgroundColor: imam ? theme.gold : theme.accent,
        opacity: imam ? 1 : 0.5 + 0.5 * (index / BEADS),
      }}
    />
  );
}

/** Opening animation: the beads of a tasbih appear one by one, then the name fades in. */
export function IntroSplash({ onDone }: IntroSplashProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(true);
  const glow = useSharedValue(0);

  useEffect(() => {
    glow.value = withDelay(1000, withTiming(1, { duration: 900 }));
    const timer = setTimeout(() => setVisible(false), HOLD_MS + 600);
    return () => clearTimeout(timer);
  }, [glow]);

  useEffect(() => {
    if (!visible) {
      onDone();
    }
  }, [visible, onDone]);

  const crescent = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: 0.8 + 0.2 * glow.value }],
  }));

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      exiting={FadeOut.duration(450)}
      style={[StyleSheet.absoluteFill, styles.root, { backgroundColor: theme.background }]}>
      <View style={{ width: RING, height: RING }}>
        {Array.from({ length: BEADS }, (_, index) => (
          <Bead key={index} index={index} />
        ))}
        <Animated.View style={[styles.crescentWrap, crescent]}>
          <View style={[styles.moon, { backgroundColor: theme.gold }]} />
          <View style={[styles.moonCut, { backgroundColor: theme.background }]} />
        </Animated.View>
      </View>
      <Animated.View entering={FadeInDown.delay(1100).duration(700)} style={styles.name}>
        <AppName size={40} />
      </Animated.View>
      <Animated.View entering={FadeIn.delay(1500).duration(600)} style={styles.line}>
        <View style={[styles.rule, { backgroundColor: theme.gold }]} />
      </Animated.View>
    </Animated.View>
  );
}

const MOON = 74;

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  crescentWrap: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  moon: { width: MOON, height: MOON, borderRadius: MOON / 2 },
  moonCut: {
    position: 'absolute',
    width: MOON * 0.82,
    height: MOON * 0.82,
    borderRadius: MOON,
    transform: [{ translateX: MOON * 0.22 }, { translateY: -MOON * 0.04 }],
  },
  name: { marginTop: spacing.md },
  line: { alignItems: 'center' },
  rule: { width: 48, height: 2, borderRadius: 1, opacity: 0.8 },
});

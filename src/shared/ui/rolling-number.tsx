import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type TextStyle } from 'react-native';
import { layoutDirection } from '@/shared/i18n';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from './app-text';

/** Slow enough to follow with the eye, like the digits of a countdown clock. */
const DURATION = 520;

type DigitSlotProps = {
  char: string;
  /** -1 drops new digits in from above (counting forward), 1 lifts them in from below (undo). */
  direction: 1 | -1;
  height: number;
  textStyle: TextStyle;
};

/** One character position. When the character changes the old one rolls out, the new one in. */
function DigitSlot({ char, direction, height, textStyle }: DigitSlotProps) {
  const progress = useSharedValue(1);
  const slide = useSharedValue<number>(1);
  const [previous, setPrevious] = useState(char);
  const shown = useRef(char);

  useEffect(() => {
    if (shown.current === char) {
      return;
    }
    setPrevious(shown.current);
    shown.current = char;
    slide.value = direction;
    progress.value = 0;
    progress.value = withTiming(1, { duration: DURATION, easing: Easing.out(Easing.cubic) });
  }, [char, direction, progress, slide]);

  const incoming = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * slide.value * height }],
  }));
  const outgoing = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ translateY: -progress.value * slide.value * height }],
  }));

  return (
    <View style={[styles.slot, { height }]}>
      <Animated.View style={incoming}>
        <AppText style={textStyle}>{char}</AppText>
      </Animated.View>
      <Animated.View style={[styles.outgoing, outgoing]} pointerEvents="none">
        <AppText style={textStyle}>{previous}</AppText>
      </Animated.View>
    </View>
  );
}

type RollingNumberProps = {
  /** The text to show, already written in the right digits. */
  text: string;
  /** Any number that grows when the user counts forward. Decides which way digits roll. */
  trend: number;
  textStyle: TextStyle & { lineHeight: number };
};

/**
 * A number whose digits roll like an odometer or a countdown clock instead of snapping.
 * Counting forward drops each new digit in from the top; undoing lifts it back up.
 */
export function RollingNumber({ text, trend, textStyle }: RollingNumberProps) {
  // Derived during render so the new digit already knows which way to roll.
  const [motion, setMotion] = useState<{ trend: number; direction: 1 | -1 }>({
    trend,
    direction: -1,
  });
  if (motion.trend !== trend) {
    setMotion({ trend, direction: trend >= motion.trend ? -1 : 1 });
  }
  const { direction } = motion;

  const chars = [...text];

  return (
    <View
      accessible
      accessibilityLabel={text}
      accessibilityLiveRegion="polite"
      style={[styles.row, layoutDirection(false)]}>
      {chars.map((char, index) => (
        <DigitSlot
          // Keyed from the right so the units digit keeps its slot when the number grows.
          key={chars.length - index}
          char={char}
          direction={direction}
          height={textStyle.lineHeight}
          textStyle={textStyle}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  // Digits always read left to right, also inside a right-to-left screen.
  row: { flexDirection: 'row', alignItems: 'center' },
  slot: { overflow: 'hidden' },
  outgoing: { position: 'absolute', left: 0, top: 0 },
});

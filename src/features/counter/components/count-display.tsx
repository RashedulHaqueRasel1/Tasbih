import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useI18n } from '@/shared/i18n';
import { spacing } from '@/shared/theme';
import { AppText, RollingNumber } from '@/shared/ui';

type CountDisplayProps = {
  count: number;
  target: number;
  rounds: number;
  /** Total taps so far. Decides if digits roll up (counting) or down (undo). Defaults to count. */
  trend?: number;
  /** `compact` fits inside the oval mala. */
  size?: 'large' | 'compact';
  /** `left` puts the count and a one-line "of 33 · round 2" in a left-aligned column. */
  align?: 'center' | 'left';
  /** Hide the round number where rounds do not apply (chain steps). */
  showRounds?: boolean;
};

const BASE = {
  large: { fontSize: 88, lineHeight: 100 },
  compact: { fontSize: 64, lineHeight: 72 },
} as const;

/** Long numbers get a smaller font so they never run out of the screen. */
const fitScale = (digits: number) =>
  digits <= 4 ? 1 : digits === 5 ? 0.82 : digits === 6 ? 0.68 : 0.56;

export function CountDisplay({
  count,
  target,
  rounds,
  trend,
  size = 'large',
  align = 'center',
  showRounds = true,
}: CountDisplayProps) {
  const { t, n } = useI18n();
  const scale = useSharedValue(1);
  const isFirstRender = useRef(true);
  const left = align === 'left';

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scale.value = withSequence(
      withTiming(1.04, { duration: 70 }),
      withSpring(1, { damping: 20, stiffness: 260 }),
    );
  }, [count, scale]);

  const pulse = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const text = n(count);
  const factor = fitScale(String(count).length);
  const textStyle = {
    fontSize: Math.round(BASE[size].fontSize * factor),
    lineHeight: Math.round(BASE[size].lineHeight * factor),
    fontWeight: '600',
  } as const;

  const targetLabel = target > 0 ? t('counter.of', { target }) : t('counter.noTarget');
  const detail = showRounds
    ? `${targetLabel} · ${t('counter.round', { round: rounds })}`
    : targetLabel;

  return (
    <View style={[styles.root, left && styles.rootLeft]}>
      <Animated.View style={[pulse, left && styles.pulseLeft]}>
        <RollingNumber text={text} trend={trend ?? count} textStyle={textStyle} />
      </Animated.View>
      <AppText variant="caption" color="textSecondary">
        {detail}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', gap: spacing.xs },
  rootLeft: { alignItems: 'flex-start' },
  pulseLeft: { transformOrigin: 'left center' },
});

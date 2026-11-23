import { StyleSheet, View } from 'react-native';

import { useI18n } from '@/shared/i18n';
import { radius, spacing, useTheme } from '@/shared/theme';
import { AppText } from '@/shared/ui';

type ChainStepIndicatorProps = {
  chainName: string;
  stepIndex: number;
  stepCount: number;
  finished: boolean;
};

/** Row of dots, one per step: done and current steps are filled. */
export function ChainStepIndicator({
  chainName,
  stepIndex,
  stepCount,
  finished,
}: ChainStepIndicatorProps) {
  const theme = useTheme();
  const { t } = useI18n();

  return (
    <View
      accessible
      accessibilityLabel={t('chain.stepOf', {
        name: chainName,
        step: Math.min(stepIndex + 1, stepCount),
        count: stepCount,
      })}
      style={styles.root}>
      <AppText variant="captionBold" color="textSecondary">
        {chainName}
      </AppText>
      <View style={styles.dots}>
        {Array.from({ length: stepCount }, (_, i) => {
          const reached = finished || i <= stepIndex;
          return (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: reached ? theme.accent : theme.surfaceSelected },
                i === stepIndex && !finished && styles.current,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', gap: spacing.xs },
  dots: { flexDirection: 'row', gap: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: radius.pill },
  current: { transform: [{ scale: 1.5 }] },
});

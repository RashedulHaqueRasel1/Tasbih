import { StyleSheet, View } from 'react-native';

import { radius, useTheme } from '@/shared/theme';

type GoalProgressBarProps = {
  /** 0 to 1 */
  progress: number;
};

export function GoalProgressBar({ progress }: GoalProgressBarProps) {
  const theme = useTheme();
  const done = progress >= 1;

  return (
    <View style={[styles.track, { backgroundColor: theme.surfaceSelected }]}>
      <View
        style={[
          styles.fill,
          { backgroundColor: done ? theme.gold : theme.accent, width: `${progress * 100}%` },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 8, alignSelf: 'stretch', borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
});

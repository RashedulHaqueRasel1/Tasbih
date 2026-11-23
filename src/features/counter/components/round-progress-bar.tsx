import { StyleSheet, View } from 'react-native';

import { radius, useTheme } from '@/shared/theme';

type RoundProgressBarProps = {
  /** 0 to 1 */
  progress: number;
};

export function RoundProgressBar({ progress }: RoundProgressBarProps) {
  const theme = useTheme();

  return (
    <View style={[styles.track, { backgroundColor: theme.surface }]}>
      <View style={[styles.fill, { backgroundColor: theme.accent, width: `${progress * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 8, alignSelf: 'stretch', borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
});

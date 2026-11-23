import { StyleSheet } from 'react-native';

import { spacing } from '@/shared/theme';
import { AppText, Surface } from '@/shared/ui';

type StatTileProps = {
  value: string;
  label: string;
};

export function StatTile({ value, label }: StatTileProps) {
  return (
    <Surface tone="surface" style={styles.root}>
      <AppText variant="headline" color="accent">
        {value}
      </AppText>
      <AppText variant="caption" color="textSecondary">
        {label}
      </AppText>
    </Surface>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.md, borderRadius: 16, gap: spacing.xs },
});

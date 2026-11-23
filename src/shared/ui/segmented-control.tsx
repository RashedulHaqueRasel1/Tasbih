import { StyleSheet, View } from 'react-native';

import { radius, spacing, useTheme } from '@/shared/theme';

import { Chip } from './chip';

type SegmentedControlProps<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const theme = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.surface }]}>
      {options.map((option) => (
        <View key={option.value} style={styles.segment}>
          <Chip
            label={option.label}
            selected={option.value === value}
            onPress={() => onChange(option.value)}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    padding: spacing.xs,
    gap: spacing.xs,
    borderRadius: radius.pill,
  },
  segment: { flex: 1 },
});

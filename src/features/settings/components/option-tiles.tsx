import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { radius, spacing, useTheme } from '@/shared/theme';
import { AppText, type IconName } from '@/shared/ui';

export type TileOption<T extends string> = {
  value: T;
  label: string;
  icon: IconName;
};

type OptionTilesProps<T extends string> = {
  options: readonly TileOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** Big, easy-to-hit choices with an icon. The picked one is outlined and ticked. */
export function OptionTiles<T extends string>({ options, value, onChange }: OptionTilesProps<T>) {
  const theme = useTheme();

  return (
    <View style={styles.root}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.tile,
              {
                backgroundColor: theme.background,
                borderColor: selected ? theme.accent : theme.surfaceSelected,
              },
              pressed && styles.pressed,
            ]}>
            {selected && (
              <View style={[styles.check, { backgroundColor: theme.accent }]}>
                <Ionicons name="checkmark" size={12} color={theme.background} />
              </View>
            )}
            <Ionicons
              name={option.icon}
              size={26}
              color={selected ? theme.accent : theme.textSecondary}
            />
            <AppText variant="caption" color={selected ? 'text' : 'textSecondary'}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: 'row', gap: spacing.sm },
  tile: {
    flex: 1,
    minHeight: 84,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 2,
    paddingVertical: spacing.sm,
  },
  check: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 18,
    height: 18,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
});

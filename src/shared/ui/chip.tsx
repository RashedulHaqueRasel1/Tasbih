import { Pressable, StyleSheet } from 'react-native';

import { radius, spacing, useTheme } from '@/shared/theme';

import { AppText } from './app-text';

type ChipProps = {
  label: string;
  onPress: () => void;
  selected?: boolean;
  accessibilityLabel?: string;
};

export function Chip({ label, onPress, selected = false, accessibilityLabel }: ChipProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: selected ? theme.accent : theme.surface },
        pressed && styles.pressed,
      ]}>
      <AppText variant="caption" color={selected ? 'background' : 'text'}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
});

import { Pressable, StyleSheet } from 'react-native';

import { radius, spacing, useTheme } from '@/shared/theme';

import { AppText } from './app-text';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
};

export function Button({ label, onPress, variant = 'secondary', disabled = false }: ButtonProps) {
  const theme = useTheme();
  const primary = variant === 'primary';
  const danger = variant === 'danger';
  const filled = primary || danger;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: danger ? theme.danger : primary ? theme.accent : theme.surface },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <AppText variant="captionBold" color={filled ? 'background' : 'text'}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.4 },
});

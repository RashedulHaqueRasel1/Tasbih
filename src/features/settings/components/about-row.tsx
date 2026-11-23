import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';

import { useI18n } from '@/shared/i18n';
import { radius, spacing, useTheme } from '@/shared/theme';
import { AppText, type IconName } from '@/shared/ui';

type AboutRowProps = {
  icon: IconName;
  label: string;
  /** Shown at the end instead of an arrow, for rows that only display a value. */
  value?: string;
  onPress?: () => void;
};

/** One line in the About card: icon, label and either an arrow or a value. */
export function AboutRow({ icon, label, value, onPress }: AboutRowProps) {
  const theme = useTheme();
  const { isRTL } = useI18n();

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: theme.surfaceSelected },
        pressed && styles.pressed,
      ]}>
      <Ionicons name={icon} size={20} color={theme.accent} />
      <AppText style={styles.label}>{label}</AppText>
      {value !== undefined ? (
        <AppText color="textSecondary">{value}</AppText>
      ) : (
        <Ionicons
          name={isRTL ? 'chevron-back' : 'chevron-forward'}
          size={18}
          color={theme.textSecondary}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  label: { flex: 1 },
  pressed: { opacity: 0.7 },
});

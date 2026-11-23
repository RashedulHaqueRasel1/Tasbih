import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { useI18n } from '@/shared/i18n';
import { radius, spacing, useTheme } from '@/shared/theme';
import { AppText, Surface, type IconName } from '@/shared/ui';

type ControlProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Icon shown above the label. Ignored when `value` is set. */
  icon?: IconName;
  /** Large value shown above the label instead of an icon (the target). */
  value?: string;
};

function Control({ label, onPress, disabled = false, icon, value }: ControlProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={value ? `${label} ${value}` : label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.control, pressed && styles.pressed, disabled && styles.off]}>
      {value !== undefined ? (
        <AppText variant="headline" color="accent" style={styles.value}>
          {value}
        </AppText>
      ) : (
        icon && <Ionicons name={icon} size={24} color={theme.text} />
      )}
      <AppText variant="caption" color="textSecondary">
        {label}
      </AppText>
    </Pressable>
  );
}

type ControlBarProps = {
  onUndo: () => void;
  onReset: () => void;
  /** True while there is nothing to undo or reset. */
  pristine: boolean;
  /** Middle control: the round target, or "Exit chain" while reciting a chain. */
  center: { label: string; onPress: () => void; value?: string; icon?: IconName };
  /** Hides the header and dhikr chips so only the count is left. */
  focus: { active: boolean; onToggle: () => void };
};

/** Undo, target and reset in one rounded bar at the bottom of the counter. */
export function ControlBar({ onUndo, onReset, pristine, center, focus }: ControlBarProps) {
  const theme = useTheme();
  const { t } = useI18n();
  const divider = <View style={[styles.divider, { backgroundColor: theme.surfaceSelected }]} />;

  return (
    <Surface tone="surface" style={styles.root}>
      <Control
        label={t('counter.undo')}
        icon="arrow-undo-outline"
        onPress={onUndo}
        disabled={pristine}
      />
      {divider}
      <Control {...center} />
      {divider}
      <Control
        label={focus.active ? t('counter.focusExit') : t('counter.focus')}
        icon={focus.active ? 'eye-outline' : 'eye-off-outline'}
        onPress={focus.onToggle}
      />
      {divider}
      <Control
        label={t('counter.reset')}
        icon="refresh-outline"
        onPress={onReset}
        disabled={pristine}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
  },
  control: {
    flex: 1,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  divider: { width: StyleSheet.hairlineWidth, height: 32 },
  value: { lineHeight: 28 },
  pressed: { opacity: 0.6 },
  off: { opacity: 0.35 },
});

import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { radius, spacing, useTheme } from '@/shared/theme';
import { AppText, Surface, type IconName } from '@/shared/ui';

type SettingsSectionProps = {
  icon: IconName;
  title: string;
  /** One short line that says what the setting does. */
  hint?: string;
  children: React.ReactNode;
};

/** A titled card that groups related settings. */
export function SettingsSection({ icon, title, hint, children }: SettingsSectionProps) {
  const theme = useTheme();

  return (
    <Surface tone="surface" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: theme.surfaceSelected }]}>
          <Ionicons name={icon} size={20} color={theme.accent} />
        </View>
        <View style={styles.titles}>
          <AppText variant="body" style={styles.title}>
            {title}
          </AppText>
          {hint ? (
            <AppText variant="caption" color="textSecondary">
              {hint}
            </AppText>
          ) : null}
        </View>
      </View>
      {children}
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: spacing.md, gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  badge: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: { flex: 1 },
  title: { fontWeight: '700' },
});

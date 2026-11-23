import { ScrollView, StyleSheet } from 'react-native';

import { useI18n, type TranslationKey } from '@/shared/i18n';
import { radius, spacing } from '@/shared/theme';
import { AppText, Screen, ScreenHeader, Surface } from '@/shared/ui';

const SECTIONS = [1, 2, 3, 4, 5] as const;

export function PrivacyScreen() {
  const { t } = useI18n();

  return (
    <Screen>
      <ScreenHeader title={t('privacy.title')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppText color="textSecondary">{t('privacy.intro')}</AppText>
        {SECTIONS.map((n) => (
          <Surface key={n} tone="surface" style={styles.card}>
            <AppText style={styles.title}>{t(`privacy.s${n}Title` as TranslationKey)}</AppText>
            <AppText color="textSecondary">{t(`privacy.s${n}Body` as TranslationKey)}</AppText>
          </Surface>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.lg },
  card: { borderRadius: radius.lg, padding: spacing.md, gap: spacing.xs },
  title: { fontWeight: '700' },
});

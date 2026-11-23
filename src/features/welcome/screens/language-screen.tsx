import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useI18n, useLanguageStore } from '@/shared/i18n';
import { spacing } from '@/shared/theme';
import { AppText, Button, LanguagePicker, Screen } from '@/shared/ui';

type LanguageScreenProps = {
  onContinue: () => void;
};

/** First-run step: pick a language. The screen switches language live as the user taps. */
export function LanguageScreen({ onContinue }: LanguageScreenProps) {
  const { t } = useI18n();
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const confirm = useLanguageStore((s) => s.confirm);

  return (
    <Screen>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <AppText variant="arabic" color="accent" style={styles.centered}>
          بِسْمِ اللَّهِ
        </AppText>
        <AppText variant="title" style={styles.centered}>
          {t('language.title')}
        </AppText>
        <AppText color="textSecondary" style={styles.centered}>
          {t('language.subtitle')}
        </AppText>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.list}>
        <LanguagePicker value={language} onChange={setLanguage} />
      </Animated.View>

      <View>
        <Button
          label={t('language.continue')}
          variant="primary"
          onPress={() => {
            confirm();
            onContinue();
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.lg },
  list: { flex: 1, justifyContent: 'center' },
  centered: { textAlign: 'center' },
});

import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, ScrollView, StyleSheet } from 'react-native';

import { useI18n, useLanguageStore } from '@/shared/i18n';
import { spacing, useThemePreferenceStore, type ThemePreference } from '@/shared/theme';
import { feedbackUrl, reviewUrl } from '@/shared/app-links';
import { ConfirmDialog, LanguagePicker, Screen, ScreenHeader } from '@/shared/ui';

import { AboutRow } from '../components/about-row';
import { MalaPreview } from '../components/mala-preview';
import { OptionTiles, type TileOption } from '../components/option-tiles';
import { SettingsSection } from '../components/settings-section';
import { SkinPicker } from '../components/skin-picker';
import { useSettingsStore, type DisplayMode, type MalaStyle } from '../store/settings-store';

export function SettingsScreen() {
  const { t, n } = useI18n();
  const router = useRouter();
  const [unavailable, setUnavailable] = useState(false);
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const confirmLanguage = useLanguageStore((s) => s.confirm);
  const themePreference = useThemePreferenceStore((s) => s.preference);
  const setThemePreference = useThemePreferenceStore((s) => s.setPreference);
  const displayMode = useSettingsStore((s) => s.displayMode);
  const setDisplayMode = useSettingsStore((s) => s.setDisplayMode);
  const malaStyle = useSettingsStore((s) => s.malaStyle);
  const setMalaStyle = useSettingsStore((s) => s.setMalaStyle);
  const skinId = useSettingsStore((s) => s.skinId);
  const setSkinId = useSettingsStore((s) => s.setSkinId);

  const themeOptions: readonly TileOption<ThemePreference>[] = [
    { value: 'auto', label: t('settings.themeAuto'), icon: 'phone-portrait-outline' },
    { value: 'light', label: t('settings.themeLight'), icon: 'sunny-outline' },
    { value: 'dark', label: t('settings.themeDark'), icon: 'moon-outline' },
  ];
  const displayOptions: readonly TileOption<DisplayMode>[] = [
    {
      value: 'bead',
      label: t('settings.displayBead'),
      icon: 'ellipsis-horizontal-circle-outline',
    },
    { value: 'simple', label: t('settings.displaySimple'), icon: 'text-outline' },
  ];
  const styleOptions: readonly TileOption<MalaStyle>[] = [
    { value: 'oval', label: t('settings.styleOval'), icon: 'ellipse-outline' },
    { value: 'vertical', label: t('settings.styleVertical'), icon: 'swap-vertical-outline' },
  ];

  const open = (url: string | null) => {
    if (url === null) {
      setUnavailable(true);
      return;
    }
    Linking.openURL(url).catch(() => setUnavailable(true));
  };

  return (
    <Screen>
      <ScreenHeader title={t('settings.title')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SettingsSection
          icon="language-outline"
          title={t('settings.language')}
          hint={t('settings.languageHint')}>
          <LanguagePicker
            value={language}
            onChange={(next) => {
              setLanguage(next);
              confirmLanguage();
            }}
          />
        </SettingsSection>

        <SettingsSection
          icon="color-palette-outline"
          title={t('settings.theme')}
          hint={t('settings.themeHint')}>
          <OptionTiles
            options={themeOptions}
            value={themePreference}
            onChange={setThemePreference}
          />
        </SettingsSection>

        <SettingsSection
          icon="apps-outline"
          title={t('settings.display')}
          hint={t('settings.displayHint')}>
          <OptionTiles options={displayOptions} value={displayMode} onChange={setDisplayMode} />
        </SettingsSection>

        {displayMode === 'bead' && (
          <>
            <SettingsSection
              icon="git-commit-outline"
              title={t('settings.malaStyle')}
              hint={t('settings.malaHint')}>
              <OptionTiles options={styleOptions} value={malaStyle} onChange={setMalaStyle} />
            </SettingsSection>

            <SettingsSection
              icon="diamond-outline"
              title={t('settings.skin')}
              hint={t('settings.skinHint')}>
              <MalaPreview skinId={skinId} vertical={malaStyle === 'vertical'} />
              <SkinPicker selectedId={skinId} onSelect={setSkinId} />
            </SettingsSection>
          </>
        )}

        <SettingsSection
          icon="information-circle-outline"
          title={t('settings.about')}
          hint={t('settings.aboutHint')}>
          <AboutRow
            icon="star-outline"
            label={t('settings.rate')}
            onPress={() => open(reviewUrl())}
          />
          <AboutRow
            icon="chatbubble-ellipses-outline"
            label={t('settings.feedback')}
            onPress={() => open(feedbackUrl(t('settings.feedback')))}
          />
          <AboutRow
            icon="shield-checkmark-outline"
            label={t('settings.privacy')}
            onPress={() => router.push('/privacy')}
          />
          <AboutRow
            icon="pricetag-outline"
            label={t('settings.version')}
            value={n(Constants.expoConfig?.version ?? '1.0.0')}
          />
        </SettingsSection>
      </ScrollView>

      <ConfirmDialog
        visible={unavailable}
        title={t('settings.unavailableTitle')}
        message={t('settings.unavailableMessage')}
        confirmLabel={t('common.done')}
        onConfirm={() => setUnavailable(false)}
        onCancel={() => setUnavailable(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.lg },
});

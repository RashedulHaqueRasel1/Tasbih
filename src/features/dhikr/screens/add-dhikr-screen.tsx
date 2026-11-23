import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { useI18n, type TranslationKey } from '@/shared/i18n';
import { MAX_TARGET } from '@/shared/limits';
import { AppText, Button, Screen, ScreenHeader, TextField } from '@/shared/ui';

import { useDhikrStore } from '../store/dhikr-store';
import type { Dhikr } from '../types';
import { validateNewDhikr } from '../utils/dhikr-utils';

type AddDhikrScreenProps = {
  onSaved: (dhikr: Dhikr) => void;
};

export function AddDhikrScreen({ onSaved }: AddDhikrScreenProps) {
  const { t } = useI18n();
  const addCustom = useDhikrStore((s) => s.addCustom);
  const [transliteration, setTransliteration] = useState('');
  const [arabic, setArabic] = useState('');
  const [meaning, setMeaning] = useState('');
  const [target, setTarget] = useState('33');
  const [error, setError] = useState<TranslationKey | null>(null);

  const handleSave = () => {
    const result = validateNewDhikr({ transliteration, arabic, meaning, target });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSaved(addCustom(result.value));
  };

  return (
    <Screen>
      <ScreenHeader title={t('dhikr.new')} />
      <TextField
        label={t('dhikr.name')}
        value={transliteration}
        onChangeText={(v) => {
          setTransliteration(v);
          setError(null);
        }}
        placeholder="Ya Allah"
      />
      <TextField
        label={t('dhikr.arabicOptional')}
        value={arabic}
        onChangeText={setArabic}
        placeholder="يا الله"
        style={styles.arabicInput}
      />
      <TextField label={t('dhikr.meaningOptional')} value={meaning} onChangeText={setMeaning} />
      <TextField
        label={t('dhikr.target')}
        value={target}
        onChangeText={(v) => {
          setTarget(v);
          setError(null);
        }}
        keyboardType="number-pad"
      />
      {error !== null && (
        <AppText variant="caption" color="danger" accessibilityLiveRegion="polite">
          {t(error, { min: 1, max: MAX_TARGET })}
        </AppText>
      )}
      <Button label={t('dhikr.save')} onPress={handleSave} variant="primary" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  arabicInput: { textAlign: 'right', fontSize: 20 },
});

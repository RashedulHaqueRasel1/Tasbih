import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { dhikrName, useAllDhikr } from '@/features/dhikr';
import { useI18n, type TranslationKey } from '@/shared/i18n';
import { MAX_TARGET } from '@/shared/limits';
import { spacing } from '@/shared/theme';
import { AppText, Button, Chip, Screen, ScreenHeader, TextField } from '@/shared/ui';

import { useChainStore } from '../store/chain-store';
import type { Chain, ChainStep } from '../types';
import { validateNewChain } from '../utils/chain-utils';

type AddChainScreenProps = {
  onSaved: (chain: Chain) => void;
};

export function AddChainScreen({ onSaved }: AddChainScreenProps) {
  const { t, n, language } = useI18n();
  const addCustom = useChainStore((s) => s.addCustom);
  const allDhikr = useAllDhikr();

  const [name, setName] = useState('');
  const [steps, setSteps] = useState<ChainStep[]>([]);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [targetText, setTargetText] = useState('33');
  const [error, setError] = useState<TranslationKey | null>(null);

  const picked = allDhikr.find((d) => d.id === pickedId) ?? allDhikr[0];
  const nameOf = (id: string) => {
    const dhikr = allDhikr.find((d) => d.id === id);
    return dhikr ? dhikrName(dhikr, language) : id;
  };

  const pick = (id: string, defaultTarget: number) => {
    setPickedId(id);
    setTargetText(String(defaultTarget));
  };

  const addStep = () => {
    const target = Number(targetText);
    if (!picked || !Number.isInteger(target) || target < 1) {
      setError('chain.stepError');
      return;
    }
    setSteps([...steps, { dhikrId: picked.id, target }]);
    setError(null);
  };

  const save = () => {
    const result = validateNewChain(name, steps);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSaved(addCustom(result.value));
  };

  return (
    <Screen>
      <ScreenHeader title={t('chain.new')} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TextField
          label={t('chain.name')}
          value={name}
          onChangeText={(v) => {
            setName(v);
            setError(null);
          }}
          placeholder={t('chain.namePlaceholder')}
        />

        <View style={styles.block}>
          <AppText variant="captionBold" color="textSecondary">
            {t('chain.steps')}
          </AppText>
          {steps.length === 0 && (
            <AppText variant="caption" color="textSecondary">
              {t('chain.noSteps')}
            </AppText>
          )}
          {steps.map((step, i) => (
            <View key={`${step.dhikrId}-${i}`} style={styles.stepRow}>
              <AppText variant="body">
                {n(i + 1)}. {nameOf(step.dhikrId)} × {n(step.target)}
              </AppText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('chain.removeStepLabel', { n: i + 1 })}
                hitSlop={spacing.sm}
                onPress={() => setSteps(steps.filter((_, index) => index !== i))}>
                <AppText variant="caption" color="danger">
                  {t('common.remove')}
                </AppText>
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.block}>
          <AppText variant="captionBold" color="textSecondary">
            {t('chain.addStepTitle')}
          </AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}>
            {allDhikr.map((d) => (
              <Chip
                key={d.id}
                label={dhikrName(d, language)}
                selected={d.id === picked?.id}
                onPress={() => pick(d.id, d.defaultTarget)}
              />
            ))}
          </ScrollView>
          <TextField
            label={t('chain.stepTarget')}
            value={targetText}
            onChangeText={setTargetText}
            keyboardType="number-pad"
          />
          <Button label={t('chain.addStep')} onPress={addStep} />
        </View>

        {error !== null && (
          <AppText variant="caption" color="danger" accessibilityLiveRegion="polite">
            {t(error, { min: 1, max: MAX_TARGET })}
          </AppText>
        )}
      </ScrollView>
      <Button label={t('chain.save')} variant="primary" onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingBottom: spacing.md },
  block: { gap: spacing.sm },
  chips: { gap: spacing.sm },
  stepRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

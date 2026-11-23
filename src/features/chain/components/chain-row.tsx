import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { dhikrName, useAllDhikr } from '@/features/dhikr';
import { useI18n } from '@/shared/i18n';
import { radius, spacing } from '@/shared/theme';
import { AppText, Button, ConfirmDialog, Surface } from '@/shared/ui';

import type { Chain } from '../types';
import { chainTotalTaps } from '../utils/chain-logic';
import { chainName } from '../utils/chain-utils';

type ChainRowProps = {
  chain: Chain;
  onStart: () => void;
  onDelete: () => void;
};

export function ChainRow({ chain, onStart, onDelete }: ChainRowProps) {
  const { t, n, language } = useI18n();
  const allDhikr = useAllDhikr();
  const name = chainName(chain, t);
  const nameOf = (id: string) => {
    const dhikr = allDhikr.find((d) => d.id === id);
    return dhikr ? dhikrName(dhikr, language) : t('chain.removedDhikr');
  };

  const [confirming, setConfirming] = useState(false);

  return (
    <Surface tone="surface" style={styles.root}>
      <View style={styles.header}>
        <AppText variant="body">{name}</AppText>
        <AppText variant="caption" color="textSecondary">
          {t('chain.taps', { n: chainTotalTaps(chain) })}
        </AppText>
      </View>
      {chain.steps.map((step, i) => (
        <AppText key={`${step.dhikrId}-${i}`} variant="caption" color="textSecondary">
          {n(i + 1)}. {nameOf(step.dhikrId)} × {n(step.target)}
        </AppText>
      ))}
      <View style={styles.actions}>
        <Button label={t('common.start')} variant="primary" onPress={onStart} />
        {chain.isCustom && (
          <Button label={t('common.delete')} onPress={() => setConfirming(true)} />
        )}
      </View>
      <ConfirmDialog
        visible={confirming}
        title={t('chain.deleteTitle')}
        message={t('chain.deleteMessage', { name })}
        confirmLabel={t('common.delete')}
        destructive
        onConfirm={() => {
          setConfirming(false);
          onDelete();
        }}
        onCancel={() => setConfirming(false)}
      />
      <ConfirmDialog
        visible={confirming}
        title={t('chain.deleteTitle')}
        message={t('chain.deleteMessage', { name })}
        confirmLabel={t('common.delete')}
        destructive
        onConfirm={() => {
          setConfirming(false);
          onDelete();
        }}
        onCancel={() => setConfirming(false)}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  root: { borderRadius: radius.md, padding: spacing.md, gap: spacing.xs },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
});

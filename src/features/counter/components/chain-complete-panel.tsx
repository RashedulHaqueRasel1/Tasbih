import { StyleSheet, View } from 'react-native';

import { useI18n } from '@/shared/i18n';
import { spacing } from '@/shared/theme';
import { AppText, Button } from '@/shared/ui';

type ChainCompletePanelProps = {
  chainName: string;
  totalTaps: number;
  onRestart: () => void;
  onExit: () => void;
};

export function ChainCompletePanel({
  chainName,
  totalTaps,
  onRestart,
  onExit,
}: ChainCompletePanelProps) {
  const { t } = useI18n();

  return (
    <View style={styles.root}>
      <AppText variant="arabic" color="accent">
        الْحَمْدُ لِلَّهِ
      </AppText>
      <AppText variant="title" style={styles.centered}>
        {t('chain.complete')}
      </AppText>
      <AppText color="textSecondary" style={styles.centered}>
        {t('chain.summary', { name: chainName, taps: totalTaps })}
      </AppText>
      <View style={styles.actions}>
        <Button label={t('chain.startAgain')} onPress={onRestart} />
        <Button label={t('common.done')} variant="primary" onPress={onExit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  centered: { textAlign: 'center' },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
});

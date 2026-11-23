import { FlatList, StyleSheet } from 'react-native';

import { useI18n } from '@/shared/i18n';
import { spacing } from '@/shared/theme';
import { Button, Screen, ScreenHeader } from '@/shared/ui';

import { ChainRow } from '../components/chain-row';
import { useAllChains } from '../hooks/use-chain';
import { useChainStore } from '../store/chain-store';
import type { Chain } from '../types';

type ChainsScreenProps = {
  onStart: (chain: Chain) => void;
  onAdd: () => void;
};

export function ChainsScreen({ onStart, onAdd }: ChainsScreenProps) {
  const { t } = useI18n();
  const chains = useAllChains();
  const removeCustom = useChainStore((s) => s.removeCustom);

  return (
    <Screen>
      <ScreenHeader title={t('chains.title')} />
      <FlatList
        data={chains}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ChainRow
            chain={item}
            onStart={() => onStart(item)}
            onDelete={() => removeCustom(item.id)}
          />
        )}
      />
      <Button label={t('chains.create')} variant="primary" onPress={onAdd} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm, paddingBottom: spacing.sm },
});

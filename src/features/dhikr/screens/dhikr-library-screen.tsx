import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';

import { useI18n } from '@/shared/i18n';
import { radius, spacing, useTheme } from '@/shared/theme';
import { AppText, Button, Screen, ScreenHeader, Scrollbar, useScrollbar } from '@/shared/ui';

import { DhikrRow } from '../components/dhikr-row';
import { useAllDhikr } from '../hooks/use-dhikr';
import { useDhikrStore } from '../store/dhikr-store';
import type { Dhikr } from '../types';
import { filterDhikr } from '../utils/dhikr-utils';

type DhikrLibraryScreenProps = {
  selectedId: string;
  onSelect: (dhikr: Dhikr) => void;
  onAdd: () => void;
};

export function DhikrLibraryScreen({ selectedId, onSelect, onAdd }: DhikrLibraryScreenProps) {
  const theme = useTheme();
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const { listProps, metrics } = useScrollbar();
  const allDhikr = useAllDhikr();
  const favoriteIds = useDhikrStore((s) => s.favoriteIds);
  const toggleFavorite = useDhikrStore((s) => s.toggleFavorite);
  const removeCustom = useDhikrStore((s) => s.removeCustom);

  const visible = useMemo(() => filterDhikr(allDhikr, query), [allDhikr, query]);

  return (
    <Screen>
      <ScreenHeader title={t('dhikr.title')} />
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={t('dhikr.search')}
        placeholderTextColor={theme.textSecondary}
        accessibilityLabel={t('dhikr.search')}
        autoCorrect={false}
        style={[styles.search, { backgroundColor: theme.surface, color: theme.text }]}
      />
      <View style={styles.listArea}>
        <FlatList
          {...listProps}
          data={visible}
          keyExtractor={(d) => d.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <AppText color="textSecondary" style={styles.empty}>
              {t('dhikr.empty')}
            </AppText>
          }
          renderItem={({ item }) => (
            <DhikrRow
              dhikr={item}
              selected={item.id === selectedId}
              favorite={favoriteIds.includes(item.id)}
              onSelect={() => onSelect(item)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onDelete={() => removeCustom(item.id)}
            />
          )}
        />
        <Scrollbar metrics={metrics} />
      </View>
      <Button label={t('dhikr.add')} onPress={onAdd} variant="primary" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    fontSize: 16,
  },
  listArea: { flex: 1 },
  // Room at the end edge so rows never sit under the scrollbar.
  list: { gap: spacing.sm, paddingBottom: spacing.sm, paddingEnd: spacing.md },
  empty: { textAlign: 'center', paddingVertical: spacing.lg },
});

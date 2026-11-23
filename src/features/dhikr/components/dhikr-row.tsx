import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useI18n } from '@/shared/i18n';
import { radius, spacing, useTheme } from '@/shared/theme';
import { AppText, ConfirmDialog, Surface } from '@/shared/ui';

import type { Dhikr } from '../types';
import { dhikrMeaning, dhikrName, showsNameLine } from '../utils/dhikr-text';

type DhikrRowProps = {
  dhikr: Dhikr;
  selected: boolean;
  favorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
};

export function DhikrRow({
  dhikr,
  selected,
  favorite,
  onSelect,
  onToggleFavorite,
  onDelete,
}: DhikrRowProps) {
  const theme = useTheme();
  const { t, language } = useI18n();
  const name = dhikrName(dhikr, language);
  const meaning = dhikrMeaning(dhikr, language);

  const [confirming, setConfirming] = useState(false);

  return (
    <Surface
      tone="surface"
      style={[styles.row, selected && { borderColor: theme.accent, borderWidth: 2 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('dhikr.use', { name })}
        onPress={onSelect}
        style={styles.main}>
        {dhikr.arabic !== '' && (
          <AppText variant="arabic" color="accent">
            {dhikr.arabic}
          </AppText>
        )}
        {showsNameLine(dhikr, language) && <AppText variant="body">{name}</AppText>}
        {meaning !== '' && (
          <AppText
            variant={language === 'bn' && dhikr.meaningBn !== '' ? 'bangla' : 'caption'}
            color="textSecondary">
            {meaning}
          </AppText>
        )}
        <AppText variant="caption" color="textSecondary">
          {t('dhikr.targetLine', { n: dhikr.defaultTarget })}
        </AppText>
      </Pressable>
      <View style={styles.side}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={favorite ? t('dhikr.favRemove') : t('dhikr.favAdd')}
          hitSlop={spacing.sm}
          onPress={onToggleFavorite}>
          <AppText variant="headline" color={favorite ? 'gold' : 'textSecondary'}>
            {favorite ? '★' : '☆'}
          </AppText>
        </Pressable>
        {dhikr.isCustom && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('dhikr.deleteLabel', { name })}
            hitSlop={spacing.sm}
            onPress={() => setConfirming(true)}>
            <AppText variant="caption" color="textSecondary">
              {t('common.delete')}
            </AppText>
          </Pressable>
        )}
      </View>
      <ConfirmDialog
        visible={confirming}
        title={t('dhikr.deleteTitle')}
        message={t('dhikr.deleteMessage', { name })}
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
  row: {
    flexDirection: 'row',
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: spacing.md,
    gap: spacing.md,
  },
  main: { flex: 1, gap: spacing.xs },
  side: { alignItems: 'flex-end', justifyContent: 'space-between' },
});

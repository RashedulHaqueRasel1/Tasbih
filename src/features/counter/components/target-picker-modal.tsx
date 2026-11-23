import { useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { layoutDirection, useI18n } from '@/shared/i18n';
import { MAX_TARGET } from '@/shared/limits';
import { radius, spacing, useTheme } from '@/shared/theme';
import { AppText, Button, Chip } from '@/shared/ui';

/** `0` stands for "no target" (count forever). */
const PRESET_TARGETS = [33, 99, 100, 313, 1000, 0] as const;

type TargetPickerModalProps = {
  visible: boolean;
  current: number;
  onSelect: (target: number) => void;
  onClose: () => void;
};

export const formatTarget = (target: number) => (target === 0 ? '∞' : String(target));

export function TargetPickerModal({ visible, current, onSelect, onClose }: TargetPickerModalProps) {
  const theme = useTheme();
  const { t, n, isRTL } = useI18n();
  const [custom, setCustom] = useState('');
  const [error, setError] = useState<string | null>(null);

  const choose = (target: number) => {
    setCustom('');
    setError(null);
    onSelect(target);
    onClose();
  };

  const applyCustom = () => {
    const value = Number(custom);
    if (!Number.isInteger(value) || value < 1 || value > MAX_TARGET) {
      setError(t('target.error', { min: 1, max: MAX_TARGET }));
      return;
    }
    choose(value);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        accessibilityLabel={t('target.close')}
        onPress={onClose}
        style={[styles.backdrop, layoutDirection(isRTL)]}>
        <Pressable
          accessible={false}
          style={[styles.sheet, { backgroundColor: theme.background }]}
          onPress={() => {}}>
          <AppText variant="headline">{t('target.title')}</AppText>
          <View style={styles.chips}>
            {PRESET_TARGETS.map((target) => (
              <Chip
                key={target}
                label={n(formatTarget(target))}
                accessibilityLabel={
                  target === 0 ? t('target.none') : t('target.label', { n: target })
                }
                selected={target === current}
                onPress={() => choose(target)}
              />
            ))}
          </View>
          <View style={styles.customRow}>
            <TextInput
              value={custom}
              onChangeText={(v) => {
                setCustom(v);
                setError(null);
              }}
              placeholder={t('target.custom')}
              placeholderTextColor={theme.textSecondary}
              accessibilityLabel={t('target.customLabel')}
              keyboardType="number-pad"
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
            />
            <Button label={t('target.set')} onPress={applyCustom} variant="primary" />
          </View>
          {error !== null && (
            <AppText variant="caption" color="danger">
              {error}
            </AppText>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    padding: spacing.lg,
    gap: spacing.md,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  customRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  input: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    fontSize: 16,
  },
});

import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { layoutDirection, useI18n } from '@/shared/i18n';
import { radius, spacing, useTheme } from '@/shared/theme';

import { AppText } from './app-text';
import { Button } from './button';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  /** Paints the confirm button red, for actions that cannot be undone. */
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** In-app replacement for the system `Alert`, styled like the rest of the app. */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const theme = useTheme();
  const { t, isRTL } = useI18n();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        accessibilityLabel={t('common.cancel')}
        onPress={onCancel}
        style={[styles.backdrop, layoutDirection(isRTL)]}>
        <Pressable
          accessible={false}
          onPress={() => {}}
          style={[styles.card, { backgroundColor: theme.background, borderColor: theme.surface }]}>
          <AppText variant="headline" style={styles.text}>
            {title}
          </AppText>
          <AppText color="textSecondary" style={styles.text}>
            {message}
          </AppText>
          <View style={styles.actions}>
            <View style={styles.action}>
              <Button label={t('common.cancel')} onPress={onCancel} />
            </View>
            <View style={styles.action}>
              <Button
                label={confirmLabel}
                onPress={onConfirm}
                variant={destructive ? 'danger' : 'primary'}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    padding: spacing.lg,
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  text: { textAlign: 'center' },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  action: { flex: 1 },
});

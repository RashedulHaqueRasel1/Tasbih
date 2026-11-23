import { Image, StyleSheet, View } from 'react-native';

import { useI18n } from '@/shared/i18n';
import { spacing } from '@/shared/theme';
import { AppName, IconButton } from '@/shared/ui';

type CounterHeaderProps = {
  onOpenChains: () => void;
  onOpenHistory: () => void;
  onOpenLibrary: () => void;
  onOpenSettings: () => void;
};

export function CounterHeader({
  onOpenChains,
  onOpenHistory,
  onOpenLibrary,
  onOpenSettings,
}: CounterHeaderProps) {
  const { t } = useI18n();

  return (
    <View pointerEvents="box-none" style={styles.root}>
      <View pointerEvents="none" style={styles.brand}>
        <Image
          source={require('../../../../assets/images/icon.png')}
          accessibilityIgnoresInvertColors
          style={styles.logo}
        />
        <AppName size={18} />
      </View>
      <View style={styles.actions}>
        <IconButton
          icon="stats-chart-outline"
          label={t('header.history')}
          onPress={onOpenHistory}
        />
        <IconButton icon="albums-outline" label={t('dhikr.all')} onPress={onOpenLibrary} />
        <IconButton icon="link-outline" label={t('header.chains')} onPress={onOpenChains} />
        <IconButton icon="settings-outline" label={t('header.settings')} onPress={onOpenSettings} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logo: { width: 32, height: 32, borderRadius: 9 },
  actions: { flexDirection: 'row', gap: spacing.sm },
});

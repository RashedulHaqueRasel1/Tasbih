import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { useI18n } from '@/shared/i18n';
import { spacing } from '@/shared/theme';

import { AppText } from './app-text';

type ScreenHeaderProps = {
  title: string;
  right?: React.ReactNode;
};

export function ScreenHeader({ title, right }: ScreenHeaderProps) {
  const router = useRouter();
  const { t, isRTL } = useI18n();

  return (
    <View style={styles.root}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
        hitSlop={spacing.sm}
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        style={styles.side}>
        <AppText color="accent">
          {isRTL ? '›' : '‹'} {t('common.back')}
        </AppText>
      </Pressable>
      <AppText variant="headline" style={styles.title}>
        {title}
      </AppText>
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  side: { flex: 1 },
  right: { alignItems: 'flex-end' },
  title: { flex: 2, textAlign: 'center' },
});

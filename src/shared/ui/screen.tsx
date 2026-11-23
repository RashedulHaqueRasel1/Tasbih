import { StyleSheet } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { layoutDirection, useI18n } from '@/shared/i18n';
import { layout, spacing } from '@/shared/theme';

import { Surface } from './surface';

type ScreenProps = {
  children: React.ReactNode;
  edges?: readonly Edge[];
};

/** Base container for every screen: themed background, safe area, centered max width. */
export function Screen({ children, edges }: ScreenProps) {
  const { isRTL } = useI18n();

  return (
    <Surface style={[styles.root, layoutDirection(isRTL)]}>
      <SafeAreaView edges={edges} style={styles.content}>
        {children}
      </SafeAreaView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    maxWidth: layout.maxContentWidth,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
});

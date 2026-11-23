import { StyleSheet, View } from 'react-native';

import { spacing } from '@/shared/theme';
import { AppText } from '@/shared/ui';

type DhikrHeadingProps = {
  arabic: string;
  /** Name line under the Arabic text. Empty hides it. */
  name: string;
  meaning: string;
  align?: 'center' | 'left';
};

export function DhikrHeading({ arabic, name, meaning, align = 'center' }: DhikrHeadingProps) {
  const left = align === 'left';
  const text = left ? styles.left : styles.centered;

  return (
    <View style={[styles.root, left ? styles.rootLeft : styles.rootCenter]}>
      {arabic !== '' && (
        <AppText variant="arabic" color="accent" style={text}>
          {arabic}
        </AppText>
      )}
      {name !== '' && (
        <AppText variant="headline" style={text}>
          {name}
        </AppText>
      )}
      {meaning !== '' && (
        <AppText variant="caption" color="textSecondary" style={text}>
          {meaning}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.xs },
  rootCenter: { alignItems: 'center', paddingHorizontal: spacing.md },
  rootLeft: { alignItems: 'flex-start' },
  centered: { textAlign: 'center' },
  // `auto` follows the reading direction, so the block hugs the right edge in Arabic.
  left: { textAlign: 'auto' },
});

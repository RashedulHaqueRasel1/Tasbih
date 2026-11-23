import { StyleSheet, View } from 'react-native';

import { MALA_SKINS } from '@/features/mala';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { radius, spacing, useTheme } from '@/shared/theme';

type MalaPreviewProps = {
  skinId: string;
  vertical: boolean;
};

const BEADS = 7;
const VERTICAL_BEADS = 5;

/** A small strand of beads in the chosen skin, so changes are visible right away. */
export function MalaPreview({ skinId, vertical }: MalaPreviewProps) {
  const theme = useTheme();
  const scheme = useColorScheme();
  const skin = MALA_SKINS.find((s) => s.id === skinId) ?? MALA_SKINS[0];

  if (!skin) {
    return null;
  }
  const colors = skin.colors[scheme];
  const count = vertical ? VERTICAL_BEADS : BEADS;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.strand,
          vertical ? styles.vertical : styles.horizontal,
          { borderColor: colors.rope },
        ]}>
        {Array.from({ length: count }, (_, index) => {
          const imam = index === Math.floor(count / 2);
          return (
            <View
              key={index}
              style={[
                styles.bead,
                vertical ? (imam ? styles.imamSmall : styles.beadSmall) : imam && styles.imam,
                {
                  backgroundColor: imam ? colors.imam : colors.bead,
                  borderColor: imam ? colors.imamEdge : colors.beadEdge,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 104,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  strand: { alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  horizontal: { flexDirection: 'row' },
  vertical: { flexDirection: 'column', gap: 2 },
  bead: { width: 28, height: 28, borderRadius: radius.pill, borderWidth: 1 },
  beadSmall: { width: 14, height: 14 },
  imamSmall: { width: 18, height: 18 },
  imam: { width: 34, height: 34 },
});

import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { MALA_SKINS } from '@/features/mala';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { useI18n, type TranslationKey } from '@/shared/i18n';
import { radius, spacing, useTheme } from '@/shared/theme';
import { AppText } from '@/shared/ui';

type SkinPickerProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export function SkinPicker({ selectedId, onSelect }: SkinPickerProps) {
  const theme = useTheme();
  const scheme = useColorScheme();
  const { t } = useI18n();

  return (
    <View style={styles.root}>
      {MALA_SKINS.map((skin) => {
        const selected = skin.id === selectedId;
        const colors = skin.colors[scheme];
        return (
          <Pressable
            key={skin.id}
            accessibilityRole="button"
            accessibilityLabel={t(`skin.${skin.id}` as TranslationKey)}
            accessibilityState={{ selected }}
            onPress={() => onSelect(skin.id)}
            style={styles.item}>
            <View
              style={[styles.swatchRing, { borderColor: selected ? theme.accent : 'transparent' }]}>
              <View
                style={[
                  styles.swatch,
                  { backgroundColor: colors.bead, borderColor: colors.beadEdge },
                ]}>
                {selected && <Ionicons name="checkmark" size={22} color={colors.imam} />}
              </View>
            </View>
            <AppText variant="caption" color={selected ? 'text' : 'textSecondary'}>
              {t(`skin.${skin.id}` as TranslationKey)}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const SWATCH = 48;

const styles = StyleSheet.create({
  root: { flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.md },
  item: { alignItems: 'center', gap: spacing.xs, width: '33.33%' },
  swatchRing: {
    width: SWATCH + 12,
    height: SWATCH + 12,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatch: {
    width: SWATCH,
    height: SWATCH,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { ScrollView, StyleSheet } from 'react-native';

import { dhikrName, type Dhikr } from '@/features/dhikr';
import { useI18n } from '@/shared/i18n';
import { spacing } from '@/shared/theme';
import { Chip } from '@/shared/ui';

type DhikrChipsProps = {
  dhikr: readonly Dhikr[];
  activeId: string;
  onSelect: (dhikr: Dhikr) => void;
};

/** Quick dhikr switcher. Scrolls edge to edge so chips are never cut off at the screen padding. */
export function DhikrChips({ dhikr, activeId, onSelect }: DhikrChipsProps) {
  const { language } = useI18n();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={styles.scroll}>
      {dhikr.map((d) => (
        <Chip
          key={d.id}
          label={dhikrName(d, language)}
          selected={d.id === activeId}
          onPress={() => onSelect(d)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Cancels the screen's horizontal padding so the row can scroll under the screen edges.
  scroll: { flexGrow: 0, marginHorizontal: -spacing.lg },
  content: { gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
});

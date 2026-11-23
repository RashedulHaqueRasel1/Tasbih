import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { LANGUAGES, layoutDirection, type Language } from '@/shared/i18n';
import { radius, spacing, useTheme } from '@/shared/theme';

import { AppText } from './app-text';

type LanguagePickerProps = {
  value: Language;
  onChange: (language: Language) => void;
};

/** Big language cards: the name in its own script, the English name below, a tick on the pick. */
export function LanguagePicker({ value, onChange }: LanguagePickerProps) {
  const theme = useTheme();

  return (
    <View style={styles.root}>
      {LANGUAGES.map((language) => {
        const selected = language.code === value;
        return (
          <Pressable
            key={language.code}
            accessibilityRole="button"
            accessibilityLabel={`${language.nativeName} (${language.englishName})`}
            accessibilityState={{ selected }}
            onPress={() => onChange(language.code)}
            style={({ pressed }) => [
              styles.card,
              // Each card lays out in its own language's direction, whatever the screen uses.
              layoutDirection(language.rtl),
              {
                backgroundColor: selected ? theme.surfaceSelected : theme.surface,
                borderColor: selected ? theme.accent : 'transparent',
              },
              pressed && styles.pressed,
            ]}>
            <View style={styles.names}>
              <AppText
                variant="headline"
                style={language.rtl ? styles.alignEnd : styles.alignStart}>
                {language.nativeName}
              </AppText>
              <AppText
                variant="caption"
                color="textSecondary"
                style={language.rtl ? styles.alignEnd : styles.alignStart}>
                {language.englishName}
              </AppText>
            </View>
            <View
              style={[
                styles.radio,
                {
                  borderColor: selected ? theme.accent : theme.textSecondary,
                  backgroundColor: selected ? theme.accent : 'transparent',
                },
              ]}>
              {selected && <Ionicons name="checkmark" size={16} color={theme.background} />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 72,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
  },
  names: { flex: 1 },
  // Explicit sides: each card follows its own language, not the direction of the screen.
  alignStart: { textAlign: 'left' },
  alignEnd: { textAlign: 'right' },
  radio: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
});

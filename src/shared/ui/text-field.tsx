import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { radius, spacing, useTheme } from '@/shared/theme';

import { AppText } from './app-text';

type TextFieldProps = TextInputProps & { label: string };

/** Labelled text input; the label doubles as the accessibility label. */
export function TextField({ label, style, ...rest }: TextFieldProps) {
  const theme = useTheme();

  return (
    <View style={styles.field}>
      <AppText variant="captionBold" color="textSecondary">
        {label}
      </AppText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { backgroundColor: theme.surface, color: theme.text }, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.xs },
  input: { minHeight: 44, paddingHorizontal: spacing.md, borderRadius: radius.md, fontSize: 16 },
});

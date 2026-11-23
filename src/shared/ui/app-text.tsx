import { Text, type TextProps } from 'react-native';

import { typography, useTheme, type ColorToken, type TextVariant } from '@/shared/theme';

export type AppTextProps = TextProps & {
  variant?: TextVariant;
  color?: ColorToken;
};

export function AppText({ variant = 'body', color = 'text', style, ...rest }: AppTextProps) {
  const theme = useTheme();

  return <Text style={[typography[variant], { color: theme[color] }, style]} {...rest} />;
}

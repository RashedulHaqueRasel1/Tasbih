import { View, type ViewProps } from 'react-native';

import { useTheme, type ColorToken } from '@/shared/theme';

export type SurfaceProps = ViewProps & {
  tone?: Extract<ColorToken, 'background' | 'surface' | 'surfaceSelected'>;
};

export function Surface({ tone = 'background', style, ...rest }: SurfaceProps) {
  const theme = useTheme();

  return <View style={[{ backgroundColor: theme[tone] }, style]} {...rest} />;
}

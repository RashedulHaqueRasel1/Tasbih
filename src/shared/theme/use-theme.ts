import { useColorScheme } from '@/shared/hooks/use-color-scheme';

import { palettes, type ColorPalette } from './colors';

export function useTheme(): ColorPalette {
  return palettes[useColorScheme()];
}

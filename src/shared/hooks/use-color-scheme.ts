import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useThemePreferenceStore } from '@/shared/theme/theme-preference-store';

/** Resolved scheme: the user's saved preference, or the system scheme when set to auto. */
export function useColorScheme(): 'light' | 'dark' {
  const preference = useThemePreferenceStore((s) => s.preference);
  const system = useSystemColorScheme();

  if (preference === 'auto') {
    return system === 'dark' ? 'dark' : 'light';
  }
  return preference;
}

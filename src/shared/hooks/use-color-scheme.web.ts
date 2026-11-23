import { useSyncExternalStore } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useThemePreferenceStore } from '@/shared/theme/theme-preference-store';

const subscribe = () => () => {};

/**
 * Static rendering on web has no color scheme, so the system value is only trusted
 * after hydration. Server snapshot is `false`, client snapshot is `true`.
 */
export function useColorScheme(): 'light' | 'dark' {
  const hasHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const preference = useThemePreferenceStore((s) => s.preference);
  const system = useSystemColorScheme();

  if (preference !== 'auto') {
    return preference;
  }
  return hasHydrated && system === 'dark' ? 'dark' : 'light';
}

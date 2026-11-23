import { useMemo } from 'react';

import { DEFAULT_DHIKR, PRESET_DHIKR } from '../data/preset-dhikr';
import { useDhikrStore } from '../store/dhikr-store';
import type { Dhikr } from '../types';
import { sortFavoritesFirst } from '../utils/dhikr-utils';

/** Presets plus the user's custom dhikr, favorites first. */
export function useAllDhikr(): Dhikr[] {
  const customDhikr = useDhikrStore((s) => s.customDhikr);
  const favoriteIds = useDhikrStore((s) => s.favoriteIds);

  return useMemo(
    () => sortFavoritesFirst([...PRESET_DHIKR, ...customDhikr], favoriteIds),
    [customDhikr, favoriteIds],
  );
}

/** Looks a dhikr up by id, falling back to the default when it no longer exists. */
export function useDhikr(id: string): Dhikr {
  const customDhikr = useDhikrStore((s) => s.customDhikr);

  return (
    PRESET_DHIKR.find((d) => d.id === id) ?? customDhikr.find((d) => d.id === id) ?? DEFAULT_DHIKR
  );
}

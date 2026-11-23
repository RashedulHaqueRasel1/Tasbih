import type { TranslationKey } from '@/shared/i18n';
import { MAX_TARGET } from '@/shared/limits';

import type { Dhikr } from '../types';

/** Case-insensitive match on transliteration, meanings and Arabic text. */
export function filterDhikr(list: readonly Dhikr[], query: string): Dhikr[] {
  const q = query.trim().toLowerCase();
  if (q === '') {
    return [...list];
  }
  return list.filter((d) =>
    [d.transliteration, d.meaning, d.meaningBn, d.arabic].some((field) =>
      field.toLowerCase().includes(q),
    ),
  );
}

/**
 * Favorites first, in the order they were favorited (the earliest one on top, each new one below
 * it). The rest keep their original order.
 */
export function sortFavoritesFirst(
  list: readonly Dhikr[],
  favoriteIds: readonly string[],
): Dhikr[] {
  const byId = new Map(list.map((dhikr) => [dhikr.id, dhikr]));
  const favorites = favoriteIds.flatMap((id) => byId.get(id) ?? []);
  const favoriteSet = new Set(favoriteIds);
  return [...favorites, ...list.filter((dhikr) => !favoriteSet.has(dhikr.id))];
}

export type NewDhikrInput = {
  transliteration: string;
  arabic: string;
  meaning: string;
  target: string;
};

export type NewDhikrValidation =
  { ok: true; value: Omit<Dhikr, 'id' | 'isCustom'> } | { ok: false; error: TranslationKey };

export function validateNewDhikr(input: NewDhikrInput): NewDhikrValidation {
  const transliteration = input.transliteration.trim();
  if (transliteration === '') {
    return { ok: false, error: 'dhikr.error.name' };
  }
  const target = Number(input.target);
  if (!Number.isInteger(target) || target < 1 || target > MAX_TARGET) {
    return { ok: false, error: 'dhikr.error.target' };
  }
  return {
    ok: true,
    value: {
      transliteration,
      arabic: input.arabic.trim(),
      meaning: input.meaning.trim(),
      meaningBn: '',
      defaultTarget: target,
    },
  };
}

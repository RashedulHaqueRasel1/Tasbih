import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from '@/shared/storage';

import type { Dhikr } from '../types';

type DhikrStore = {
  customDhikr: Dhikr[];
  favoriteIds: string[];
  addCustom: (value: Omit<Dhikr, 'id' | 'isCustom'>) => Dhikr;
  removeCustom: (id: string) => void;
  toggleFavorite: (id: string) => void;
};

export const useDhikrStore = create<DhikrStore>()(
  persist(
    (set, get) => ({
      customDhikr: [],
      favoriteIds: [],
      addCustom: (value) => {
        const dhikr: Dhikr = { ...value, id: `custom-${Date.now()}`, isCustom: true };
        set({ customDhikr: [...get().customDhikr, dhikr] });
        return dhikr;
      },
      removeCustom: (id) =>
        set({
          customDhikr: get().customDhikr.filter((d) => d.id !== id),
          favoriteIds: get().favoriteIds.filter((f) => f !== id),
        }),
      toggleFavorite: (id) => {
        const { favoriteIds } = get();
        set({
          favoriteIds: favoriteIds.includes(id)
            ? favoriteIds.filter((f) => f !== id)
            : [...favoriteIds, id],
        });
      },
    }),
    {
      name: 'tasbih/dhikr',
      version: 1,
      storage: persistStorage,
      partialize: ({ customDhikr, favoriteIds }) => ({ customDhikr, favoriteIds }),
    },
  ),
);

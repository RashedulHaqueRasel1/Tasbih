import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from '@/shared/storage';

export type ThemePreference = 'auto' | 'light' | 'dark';

type ThemePreferenceStore = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

export const useThemePreferenceStore = create<ThemePreferenceStore>()(
  persist(
    (set) => ({
      preference: 'auto',
      setPreference: (preference) => set({ preference }),
    }),
    {
      name: 'tasbih/theme',
      version: 1,
      storage: persistStorage,
      partialize: ({ preference }) => ({ preference }),
    },
  ),
);

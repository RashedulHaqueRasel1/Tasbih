import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from '@/shared/storage';

export type DisplayMode = 'bead' | 'simple';
export type MalaStyle = 'oval' | 'vertical';

type SettingsStore = {
  displayMode: DisplayMode;
  malaStyle: MalaStyle;
  skinId: string;
  setDisplayMode: (mode: DisplayMode) => void;
  setMalaStyle: (style: MalaStyle) => void;
  setSkinId: (id: string) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      displayMode: 'bead',
      malaStyle: 'oval',
      skinId: 'red-amber',
      setDisplayMode: (displayMode) => set({ displayMode }),
      setMalaStyle: (malaStyle) => set({ malaStyle }),
      setSkinId: (skinId) => set({ skinId }),
    }),
    {
      name: 'tasbih/settings',
      version: 1,
      storage: persistStorage,
      // New fields fall back to the defaults above when an older save does not have them.
      partialize: ({ displayMode, malaStyle, skinId }) => ({ displayMode, malaStyle, skinId }),
    },
  ),
);

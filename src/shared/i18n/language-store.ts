import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from '@/shared/storage';

import { detectLanguage, type Language } from './languages';

type LanguageStore = {
  language: Language;
  /** False until the user has confirmed a language on the first-run language screen. */
  chosen: boolean;
  /** Switches the app language right away (used for live preview while choosing). */
  setLanguage: (language: Language) => void;
  /** Marks the language as picked so the app opens straight to the counter next time. */
  confirm: () => void;
};

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: detectLanguage(),
      chosen: false,
      setLanguage: (language) => set({ language }),
      confirm: () => set({ chosen: true }),
    }),
    {
      name: 'tasbih/language',
      version: 1,
      storage: persistStorage,
      partialize: ({ language, chosen }) => ({ language, chosen }),
    },
  ),
);

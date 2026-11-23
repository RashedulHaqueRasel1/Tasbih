import { useSyncExternalStore } from 'react';

type PersistedStore = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (listener: () => void) => () => void;
  };
};

/** True once a zustand `persist` store has loaded its saved state, avoids a flash of default values. */
export function useStoreHydrated({ persist }: PersistedStore) {
  return useSyncExternalStore(persist.onFinishHydration, persist.hasHydrated, () => false);
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from '@/shared/storage';

import { PRESET_CHAINS } from '../data/preset-chains';
import type { Chain, ChainRun, RunEvent } from '../types';
import { isRunPristine, startRun, tapRun, undoRun } from '../utils/chain-logic';
import { findChain } from '../utils/chain-utils';

type ChainStore = {
  customChains: Chain[];
  /** The chain currently being recited, or null in normal dhikr mode. */
  run: ChainRun | null;
  startChain: (chainId: string) => void;
  /** Adds one tap to the running chain and reports what happened. */
  tap: () => RunEvent;
  undo: () => void;
  restart: () => void;
  exitChain: () => void;
  addCustom: (value: Pick<Chain, 'name' | 'steps'>) => Chain;
  removeCustom: (id: string) => void;
};

export const useChainStore = create<ChainStore>()(
  persist(
    (set, get) => {
      const currentChain = () => {
        const { run, customChains } = get();
        return findChain(run?.chainId ?? null, customChains, PRESET_CHAINS);
      };

      return {
        customChains: [],
        run: null,
        startChain: (chainId) => {
          const chain = findChain(chainId, get().customChains, PRESET_CHAINS);
          if (chain) {
            set({ run: startRun(chain) });
          }
        },
        tap: () => {
          const { run } = get();
          const chain = currentChain();
          if (!run || !chain) {
            return 'ignored';
          }
          const result = tapRun(run, chain);
          set({ run: result.run });
          return result.event;
        },
        undo: () => {
          const { run } = get();
          const chain = currentChain();
          if (run && chain && !isRunPristine(run)) {
            set({ run: undoRun(run, chain) });
          }
        },
        restart: () => {
          const chain = currentChain();
          if (chain) {
            set({ run: startRun(chain) });
          }
        },
        exitChain: () => set({ run: null }),
        addCustom: (value) => {
          const chain: Chain = { ...value, id: `chain-${Date.now()}`, isCustom: true };
          set({ customChains: [...get().customChains, chain] });
          return chain;
        },
        removeCustom: (id) => {
          const { run, customChains } = get();
          set({
            customChains: customChains.filter((c) => c.id !== id),
            run: run?.chainId === id ? null : run,
          });
        },
      };
    },
    {
      name: 'tasbih/chain',
      version: 1,
      storage: persistStorage,
      partialize: ({ customChains, run }) => ({ customChains, run }),
    },
  ),
);

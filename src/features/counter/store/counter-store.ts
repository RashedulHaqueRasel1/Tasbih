import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DEFAULT_DHIKR } from '@/features/dhikr';
import { persistStorage } from '@/shared/storage';

import {
  initialCounterState,
  reset as resetState,
  tap,
  undo as undoState,
  withTarget,
  type CounterState,
} from '../utils/counter-logic';
import { migrateCounterState, type PersistedCounter } from '../utils/migrate-counter-state';

type CounterActions = {
  /** Adds one tap to the active dhikr. Returns true when this tap completed a round. */
  increment: () => boolean;
  undo: () => void;
  reset: () => void;
  setTarget: (target: number) => void;
  /** Switches dhikr, starting its progress at `defaultTarget` the first time. */
  setActiveDhikr: (id: string, defaultTarget: number) => void;
};

export const selectActiveCounter = (s: PersistedCounter): CounterState =>
  s.progress[s.activeDhikrId] ?? initialCounterState;

export const useCounterStore = create<PersistedCounter & CounterActions>()(
  persist(
    (set, get) => {
      const updateActive = (update: (state: CounterState) => CounterState) => {
        const { activeDhikrId, progress } = get();
        set({ progress: { ...progress, [activeDhikrId]: update(selectActiveCounter(get())) } });
      };

      return {
        activeDhikrId: DEFAULT_DHIKR.id,
        progress: {
          [DEFAULT_DHIKR.id]: { ...initialCounterState, target: DEFAULT_DHIKR.defaultTarget },
        },
        increment: () => {
          const { state, roundCompleted } = tap(selectActiveCounter(get()));
          updateActive(() => state);
          return roundCompleted;
        },
        undo: () => updateActive(undoState),
        reset: () => updateActive(resetState),
        setTarget: (target) => updateActive((state) => withTarget(state, target)),
        setActiveDhikr: (id, defaultTarget) => {
          const { progress } = get();
          set({
            activeDhikrId: id,
            progress: progress[id]
              ? progress
              : { ...progress, [id]: { ...initialCounterState, target: defaultTarget } },
          });
        },
      };
    },
    {
      name: 'tasbih/counter',
      version: 2,
      storage: persistStorage,
      partialize: ({ activeDhikrId, progress }) => ({ activeDhikrId, progress }),
      migrate: (persisted, version) =>
        migrateCounterState(persisted, version, DEFAULT_DHIKR.id) as PersistedCounter &
          CounterActions,
    },
  ),
);

import { initialCounterState, type CounterState } from './counter-logic';

export type PersistedCounter = {
  activeDhikrId: string;
  progress: Record<string, CounterState>;
};

/**
 * v1 stored a single `{ count, target, rounds }` for one hard-coded dhikr.
 * v2 stores progress per dhikr, so the old values move under the default dhikr.
 */
export function migrateCounterState(
  persisted: unknown,
  version: number,
  defaultDhikrId: string,
): PersistedCounter {
  if (version < 2) {
    const old = (persisted ?? {}) as Partial<CounterState>;
    return {
      activeDhikrId: defaultDhikrId,
      progress: {
        [defaultDhikrId]: {
          count: old.count ?? initialCounterState.count,
          target: old.target ?? initialCounterState.target,
          rounds: old.rounds ?? initialCounterState.rounds,
        },
      },
    };
  }
  return persisted as PersistedCounter;
}

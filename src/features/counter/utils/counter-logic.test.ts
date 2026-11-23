import {
  initialCounterState,
  isPristine,
  reset,
  roundProgress,
  tap,
  totalTaps,
  undo,
  withTarget,
  type CounterState,
} from './counter-logic';
import { migrateCounterState } from './migrate-counter-state';

const state = (overrides: Partial<CounterState> = {}): CounterState => ({
  ...initialCounterState,
  ...overrides,
});

describe('tap', () => {
  it('adds one to the count', () => {
    const result = tap(state({ count: 4 }));
    expect(result.state.count).toBe(5);
    expect(result.roundCompleted).toBe(false);
  });

  it('completes the round when the target is reached', () => {
    const result = tap(state({ count: 32, target: 33, rounds: 1 }));
    expect(result.state).toEqual({ count: 0, target: 33, rounds: 2 });
    expect(result.roundCompleted).toBe(true);
  });

  it('never completes a round without a target', () => {
    const result = tap(state({ count: 999, target: 0 }));
    expect(result.state.count).toBe(1000);
    expect(result.roundCompleted).toBe(false);
  });
});

describe('undo', () => {
  it('removes one tap', () => {
    expect(undo(state({ count: 3 })).count).toBe(2);
  });

  it('steps back across a round boundary', () => {
    expect(undo(state({ count: 0, target: 33, rounds: 2 }))).toEqual({
      count: 32,
      target: 33,
      rounds: 1,
    });
  });

  it('does nothing on a fresh counter', () => {
    const fresh = state();
    expect(undo(fresh)).toBe(fresh);
  });
});

describe('reset and progress', () => {
  it('reset clears count and rounds but keeps the target', () => {
    expect(reset(state({ count: 10, rounds: 4, target: 99 }))).toEqual({
      count: 0,
      rounds: 1,
      target: 99,
    });
  });

  it('isPristine detects an untouched counter', () => {
    expect(isPristine(state())).toBe(true);
    expect(isPristine(state({ count: 1 }))).toBe(false);
    expect(isPristine(state({ rounds: 2 }))).toBe(false);
  });

  it('roundProgress is a 0..1 fraction and 0 without a target', () => {
    expect(roundProgress(state({ count: 33 / 3, target: 33 }))).toBeCloseTo(1 / 3);
    expect(roundProgress(state({ count: 50, target: 0 }))).toBe(0);
  });
});

describe('withTarget', () => {
  it('keeps the state when the target is unchanged', () => {
    const current = state({ count: 5 });
    expect(withTarget(current, 33)).toBe(current);
  });

  it('wraps a count that no longer fits the new target', () => {
    expect(withTarget(state({ count: 50, target: 100 }), 33).count).toBe(17);
  });

  it('keeps the count when switching to no target', () => {
    expect(withTarget(state({ count: 50, target: 100 }), 0)).toEqual({
      count: 50,
      target: 0,
      rounds: 1,
    });
  });
});

describe('totalTaps', () => {
  it('counts taps across rounds', () => {
    expect(totalTaps(state({ count: 5, target: 33, rounds: 3 }))).toBe(71);
  });

  it('is just the count without a target', () => {
    expect(totalTaps(state({ count: 12, target: 0 }))).toBe(12);
  });
});

describe('migrateCounterState', () => {
  it('moves v1 state under the default dhikr', () => {
    expect(migrateCounterState({ count: 7, target: 99, rounds: 2 }, 1, 'subhanallah')).toEqual({
      activeDhikrId: 'subhanallah',
      progress: { subhanallah: { count: 7, target: 99, rounds: 2 } },
    });
  });

  it('falls back to defaults for empty v1 state', () => {
    const migrated = migrateCounterState(undefined, 1, 'subhanallah');
    expect(migrated.progress.subhanallah).toEqual(initialCounterState);
  });

  it('passes v2 state through untouched', () => {
    const v2 = { activeDhikrId: 'durood', progress: {} };
    expect(migrateCounterState(v2, 2, 'subhanallah')).toBe(v2);
  });
});

export type CounterState = {
  count: number;
  /** Taps needed to finish one round. `0` means no target (infinite). */
  target: number;
  /** 1-based round number currently in progress. */
  rounds: number;
};

export const DEFAULT_TARGET = 33;

export const initialCounterState: CounterState = {
  count: 0,
  target: DEFAULT_TARGET,
  rounds: 1,
};

export type TapResult = {
  state: CounterState;
  roundCompleted: boolean;
};

export function tap(state: CounterState): TapResult {
  const count = state.count + 1;
  const roundCompleted = state.target > 0 && count >= state.target;

  return {
    state: roundCompleted ? { ...state, count: 0, rounds: state.rounds + 1 } : { ...state, count },
    roundCompleted,
  };
}

/** Steps back one tap, including back across a round boundary. */
export function undo(state: CounterState): CounterState {
  if (state.count > 0) {
    return { ...state, count: state.count - 1 };
  }
  if (state.rounds > 1 && state.target > 0) {
    return { ...state, count: state.target - 1, rounds: state.rounds - 1 };
  }
  return state;
}

export function reset(state: CounterState): CounterState {
  return { ...state, count: 0, rounds: 1 };
}

/** Changes the round target. A count that no longer fits is wrapped into the new round size. */
export function withTarget(state: CounterState, target: number): CounterState {
  if (target === state.target) {
    return state;
  }
  return { ...state, target, count: target > 0 ? state.count % target : state.count };
}

export function isPristine(state: CounterState): boolean {
  return state.count === 0 && state.rounds === 1;
}

/** Progress of the current round from 0 to 1. Always 0 without a target. */
export function roundProgress(state: CounterState): number {
  return state.target > 0 ? Math.min(state.count / state.target, 1) : 0;
}

/** Every tap made so far across all rounds. Drives how far the mala has turned. */
export function totalTaps(state: CounterState): number {
  return state.target > 0 ? (state.rounds - 1) * state.target + state.count : state.count;
}

/** A special count: every 33rd tap (33, 66, 99, ...). */
export const MILESTONE_EVERY = 33;

export const isMilestone = (count: number): boolean => count > 0 && count % MILESTONE_EVERY === 0;

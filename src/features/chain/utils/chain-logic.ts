import type { Chain, ChainRun, RunEvent } from '../types';

export function startRun(chain: Chain): ChainRun {
  return { chainId: chain.id, stepIndex: 0, count: 0, finished: false };
}

export function tapRun(run: ChainRun, chain: Chain): { run: ChainRun; event: RunEvent } {
  const step = chain.steps[run.stepIndex];
  if (run.finished || !step) {
    return { run, event: 'ignored' };
  }

  const count = run.count + 1;
  if (count < step.target) {
    return { run: { ...run, count }, event: 'tap' };
  }
  if (run.stepIndex >= chain.steps.length - 1) {
    return { run: { ...run, count: step.target, finished: true }, event: 'chain-complete' };
  }
  return { run: { ...run, stepIndex: run.stepIndex + 1, count: 0 }, event: 'step-complete' };
}

/** Steps back one tap, across step boundaries and out of the finished state. */
export function undoRun(run: ChainRun, chain: Chain): ChainRun {
  if (run.finished) {
    const last = chain.steps[run.stepIndex];
    return last ? { ...run, finished: false, count: last.target - 1 } : run;
  }
  if (run.count > 0) {
    return { ...run, count: run.count - 1 };
  }
  const previous = chain.steps[run.stepIndex - 1];
  if (previous) {
    return { ...run, stepIndex: run.stepIndex - 1, count: previous.target - 1 };
  }
  return run;
}

export function isRunPristine(run: ChainRun): boolean {
  return run.stepIndex === 0 && run.count === 0 && !run.finished;
}

/** Taps made so far across all steps. Drives how far the mala has turned. */
export function runTotalTaps(run: ChainRun, chain: Chain): number {
  const before = chain.steps.slice(0, run.stepIndex).reduce((sum, step) => sum + step.target, 0);
  return before + run.count;
}

export function chainTotalTaps(chain: Chain): number {
  return chain.steps.reduce((sum, step) => sum + step.target, 0);
}

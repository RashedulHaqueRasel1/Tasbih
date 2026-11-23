import { useEffect } from 'react';

import { chainName, isRunPristine, runTotalTaps, useChain, useChainStore } from '@/features/chain';
import { useDhikr, type Dhikr } from '@/features/dhikr';
import { useLogStore } from '@/features/history';
import { haptics } from '@/shared/haptics';
import { useI18n } from '@/shared/i18n';

import { selectActiveCounter, useCounterStore } from '../store/counter-store';
import { isMilestone, isPristine, totalTaps } from '../utils/counter-logic';

export type ChainInfo = {
  name: string;
  stepIndex: number;
  stepCount: number;
  finished: boolean;
  totalTaps: number;
};

export type CounterSession = {
  dhikr: Dhikr;
  count: number;
  target: number;
  rounds: number;
  /** How far the mala has turned. */
  totalTaps: number;
  pristine: boolean;
  /** Set while a chain is being recited. */
  chain: ChainInfo | null;
  tap: () => void;
  undo: () => void;
  reset: () => void;
  setTarget: (target: number) => void;
  selectDhikr: (dhikr: Dhikr) => void;
  restartChain: () => void;
  exitChain: () => void;
};

/**
 * One view of "what is being counted right now": either a single dhikr with its own saved
 * progress, or the current step of a chain. The screen renders this and does not care which.
 */
export function useCounterSession(ready: boolean): CounterSession {
  const counter = useCounterStore(selectActiveCounter);
  const activeDhikrId = useCounterStore((s) => s.activeDhikrId);
  const increment = useCounterStore((s) => s.increment);
  const undoDhikr = useCounterStore((s) => s.undo);
  const resetDhikr = useCounterStore((s) => s.reset);
  const setTarget = useCounterStore((s) => s.setTarget);
  const setActiveDhikr = useCounterStore((s) => s.setActiveDhikr);
  const record = useLogStore((s) => s.record);
  const { t } = useI18n();

  const run = useChainStore((s) => s.run);
  const tapChain = useChainStore((s) => s.tap);
  const undoChain = useChainStore((s) => s.undo);
  const restartChain = useChainStore((s) => s.restart);
  const exitChain = useChainStore((s) => s.exitChain);
  const chain = useChain(run?.chainId ?? null);

  const inChain = run !== null && chain !== undefined;
  const step = inChain ? chain.steps[run.stepIndex] : undefined;
  const dhikr = useDhikr(step?.dhikrId ?? activeDhikrId);

  // A running chain whose definition was deleted cannot continue.
  useEffect(() => {
    if (ready && run !== null && chain === undefined) {
      exitChain();
    }
  }, [ready, run, chain, exitChain]);

  // The active dhikr may have been deleted; fall back to the dhikr the lookup resolved to.
  useEffect(() => {
    if (ready && !inChain && dhikr.id !== activeDhikrId) {
      setActiveDhikr(dhikr.id, dhikr.defaultTarget);
    }
  }, [ready, inChain, dhikr, activeDhikrId, setActiveDhikr]);

  if (inChain && step) {
    return {
      dhikr,
      count: run.count,
      target: step.target,
      rounds: 1,
      totalTaps: runTotalTaps(run, chain),
      pristine: isRunPristine(run),
      chain: {
        name: chainName(chain, t),
        stepIndex: run.stepIndex,
        stepCount: chain.steps.length,
        finished: run.finished,
        totalTaps: runTotalTaps(run, chain),
      },
      tap: () => {
        const event = tapChain();
        if (event !== 'ignored') {
          record(step.dhikrId, 1);
        }
        if (event === 'chain-complete') {
          haptics.celebrate();
        } else if (event === 'step-complete') {
          haptics.success();
        } else if (event === 'tap') {
          // One buzz per tap: a firmer one on a milestone, the light one otherwise.
          if (isMilestone(run.count + 1)) {
            haptics.milestone();
          } else {
            haptics.tap();
          }
        }
      },
      undo: () => {
        if (isRunPristine(run)) {
          return;
        }
        // Undo takes back the last tap, which belongs to the previous step right after a step change.
        const undone = run.finished || run.count > 0 ? step : chain.steps[run.stepIndex - 1];
        undoChain();
        if (undone) {
          record(undone.dhikrId, -1);
        }
      },
      reset: restartChain,
      setTarget: () => {},
      selectDhikr: () => {},
      restartChain,
      exitChain,
    };
  }

  return {
    dhikr,
    count: counter.count,
    target: counter.target,
    rounds: counter.rounds,
    totalTaps: totalTaps(counter),
    pristine: isPristine(counter),
    chain: null,
    tap: () => {
      const roundCompleted = increment();
      record(dhikr.id, 1);
      if (roundCompleted) {
        haptics.success();
      } else if (isMilestone(counter.count + 1)) {
        haptics.milestone();
      } else {
        haptics.tap();
      }
    },
    undo: () => {
      if (isPristine(counter)) {
        return;
      }
      undoDhikr();
      record(dhikr.id, -1);
    },
    reset: resetDhikr,
    setTarget,
    selectDhikr: (d) => setActiveDhikr(d.id, d.defaultTarget),
    restartChain,
    exitChain,
  };
}

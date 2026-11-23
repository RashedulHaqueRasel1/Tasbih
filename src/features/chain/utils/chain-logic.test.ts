import { PRESET_CHAINS } from '../data/preset-chains';
import type { Chain, ChainRun } from '../types';
import {
  chainTotalTaps,
  isRunPristine,
  runTotalTaps,
  startRun,
  tapRun,
  undoRun,
} from './chain-logic';
import { findChain, validateNewChain } from './chain-utils';

const fatima = PRESET_CHAINS[0]!;
const small: Chain = {
  id: 'small',
  name: 'Small',
  isCustom: true,
  steps: [
    { dhikrId: 'a', target: 2 },
    { dhikrId: 'b', target: 3 },
  ],
};

const run = (overrides: Partial<ChainRun> = {}): ChainRun => ({ ...startRun(small), ...overrides });

describe('tapRun', () => {
  it('counts inside a step', () => {
    const result = tapRun(run(), small);
    expect(result.event).toBe('tap');
    expect(result.run.count).toBe(1);
  });

  it('moves to the next step when a step target is reached', () => {
    const result = tapRun(run({ count: 1 }), small);
    expect(result.event).toBe('step-complete');
    expect(result.run).toMatchObject({ stepIndex: 1, count: 0, finished: false });
  });

  it('finishes the chain on the last tap of the last step', () => {
    const result = tapRun(run({ stepIndex: 1, count: 2 }), small);
    expect(result.event).toBe('chain-complete');
    expect(result.run).toMatchObject({ finished: true, count: 3 });
  });

  it('ignores taps once finished', () => {
    const finished = run({ stepIndex: 1, count: 3, finished: true });
    const result = tapRun(finished, small);
    expect(result.event).toBe('ignored');
    expect(result.run).toBe(finished);
  });
});

describe('undoRun', () => {
  it('removes one tap inside a step', () => {
    expect(undoRun(run({ count: 1 }), small).count).toBe(0);
  });

  it('goes back into the previous step', () => {
    expect(undoRun(run({ stepIndex: 1, count: 0 }), small)).toMatchObject({
      stepIndex: 0,
      count: 1,
    });
  });

  it('leaves the finished state', () => {
    expect(undoRun(run({ stepIndex: 1, count: 3, finished: true }), small)).toMatchObject({
      finished: false,
      stepIndex: 1,
      count: 2,
    });
  });

  it('does nothing at the very start', () => {
    const start = run();
    expect(undoRun(start, small)).toBe(start);
  });
});

describe('totals', () => {
  it('sums taps across steps', () => {
    expect(runTotalTaps(run({ stepIndex: 1, count: 2 }), small)).toBe(4);
    expect(runTotalTaps(run({ stepIndex: 1, count: 3, finished: true }), small)).toBe(5);
  });

  it('knows a pristine run', () => {
    expect(isRunPristine(run())).toBe(true);
    expect(isRunPristine(run({ count: 1 }))).toBe(false);
  });

  it('Tasbih-e-Fatima is 33 + 33 + 34', () => {
    expect(chainTotalTaps(fatima)).toBe(100);
  });

  it('a full pass through a chain reaches its total and finishes', () => {
    let current = startRun(small);
    for (let i = 0; i < chainTotalTaps(small); i++) {
      current = tapRun(current, small).run;
    }
    expect(current.finished).toBe(true);
    expect(runTotalTaps(current, small)).toBe(chainTotalTaps(small));
  });
});

describe('validateNewChain', () => {
  const steps = [{ dhikrId: 'a', target: 10 }];

  it('accepts a named chain with steps', () => {
    const result = validateNewChain('  Morning ', steps);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe('Morning');
    }
  });

  it('rejects an empty name, no steps and bad targets', () => {
    expect(validateNewChain(' ', steps).ok).toBe(false);
    expect(validateNewChain('x', []).ok).toBe(false);
    expect(validateNewChain('x', [{ dhikrId: 'a', target: 0 }]).ok).toBe(false);
    expect(validateNewChain('x', [{ dhikrId: 'a', target: 200000 }]).ok).toBe(false);
  });
});

describe('findChain', () => {
  it('finds presets and custom chains, and nothing for null', () => {
    expect(findChain('tasbih-e-fatima', [], PRESET_CHAINS)?.name).toBe('Tasbih-e-Fatima');
    expect(findChain('small', [small], PRESET_CHAINS)).toBe(small);
    expect(findChain(null, [small], PRESET_CHAINS)).toBeUndefined();
  });
});

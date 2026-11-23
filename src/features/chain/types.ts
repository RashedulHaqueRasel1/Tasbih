export type ChainStep = {
  dhikrId: string;
  target: number;
};

export type Chain = {
  id: string;
  name: string;
  steps: ChainStep[];
  isCustom: boolean;
};

/** Progress through a chain: which step, and how far into it. */
export type ChainRun = {
  chainId: string;
  stepIndex: number;
  count: number;
  finished: boolean;
};

export type RunEvent = 'tap' | 'step-complete' | 'chain-complete' | 'ignored';

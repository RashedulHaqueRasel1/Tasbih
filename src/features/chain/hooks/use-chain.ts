import { useMemo } from 'react';

import { PRESET_CHAINS } from '../data/preset-chains';
import { useChainStore } from '../store/chain-store';
import type { Chain } from '../types';
import { findChain } from '../utils/chain-utils';

/** Presets plus the user's custom chains. */
export function useAllChains(): Chain[] {
  const customChains = useChainStore((s) => s.customChains);
  return useMemo(() => [...PRESET_CHAINS, ...customChains], [customChains]);
}

export function useChain(id: string | null): Chain | undefined {
  const customChains = useChainStore((s) => s.customChains);
  return findChain(id, customChains, PRESET_CHAINS);
}

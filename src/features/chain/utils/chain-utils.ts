import type { TranslationKey } from '@/shared/i18n';
import { MAX_TARGET } from '@/shared/limits';

import type { Chain, ChainStep } from '../types';

export type NewChainValidation =
  { ok: true; value: Pick<Chain, 'name' | 'steps'> } | { ok: false; error: TranslationKey };

/** Preset chains are named through the translations; custom chains keep the user's own name. */
export function chainName(chain: Chain, t: (key: TranslationKey) => string): string {
  return chain.isCustom ? chain.name : t(`chain.preset.${chain.id}` as TranslationKey);
}

export function validateNewChain(name: string, steps: readonly ChainStep[]): NewChainValidation {
  const trimmed = name.trim();
  if (trimmed === '') {
    return { ok: false, error: 'chain.error.name' };
  }
  if (steps.length === 0) {
    return { ok: false, error: 'chain.error.steps' };
  }
  if (steps.some((s) => !Number.isInteger(s.target) || s.target < 1 || s.target > MAX_TARGET)) {
    return { ok: false, error: 'chain.error.targets' };
  }
  return { ok: true, value: { name: trimmed, steps: steps.map((s) => ({ ...s })) } };
}

export function findChain(id: string | null, custom: readonly Chain[], presets: readonly Chain[]) {
  if (id === null) {
    return undefined;
  }
  return presets.find((c) => c.id === id) ?? custom.find((c) => c.id === id);
}

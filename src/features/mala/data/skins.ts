import type { ColorSchemeName } from '@/shared/theme';

export type MalaSkinColors = {
  bead: string;
  beadEdge: string;
  imam: string;
  imamEdge: string;
  tassel: string;
  rope: string;
};

export type MalaSkin = {
  id: string;
  name: string;
  colors: Record<ColorSchemeName, MalaSkinColors>;
};

const GOLD = { imam: '#d4af37', imamEdge: '#8a6d1a' } as const;

export const MALA_SKINS: readonly MalaSkin[] = [
  {
    id: 'red-amber',
    name: 'Red amber',
    colors: {
      light: { bead: '#b5472a', beadEdge: '#6b2412', ...GOLD, tassel: '#7a2f2f', rope: '#a88a6a' },
      dark: { bead: '#d9822b', beadEdge: '#6b3a0e', ...GOLD, tassel: '#d4af37', rope: '#6b5a45' },
    },
  },
  {
    id: 'wooden',
    name: 'Wooden',
    colors: {
      light: { bead: '#8a5a2b', beadEdge: '#4a2f14', ...GOLD, tassel: '#7a2f2f', rope: '#a88a6a' },
      dark: { bead: '#a9733a', beadEdge: '#4a2f14', ...GOLD, tassel: '#d4af37', rope: '#6b5a45' },
    },
  },
  {
    id: 'crystal',
    name: 'Crystal blue',
    colors: {
      light: { bead: '#2f6fd0', beadEdge: '#1b3f7a', ...GOLD, tassel: '#1f3f8f', rope: '#7d93b8' },
      dark: { bead: '#5b92e6', beadEdge: '#1b3f7a', ...GOLD, tassel: '#7aa2ff', rope: '#4a5d80' },
    },
  },
  {
    id: 'amber',
    name: 'Amber',
    colors: {
      light: { bead: '#d9822b', beadEdge: '#7a4210', ...GOLD, tassel: '#8a4a12', rope: '#b89a70' },
      dark: { bead: '#e8963f', beadEdge: '#7a4210', ...GOLD, tassel: '#e8963f', rope: '#7a6240' },
    },
  },
  {
    id: 'onyx',
    name: 'Black onyx',
    colors: {
      light: { bead: '#2a2a2a', beadEdge: '#0d0d0d', ...GOLD, tassel: '#b8902a', rope: '#8a8478' },
      dark: { bead: '#4a4a4a', beadEdge: '#0d0d0d', ...GOLD, tassel: '#d4af37', rope: '#5c5c5c' },
    },
  },
  {
    id: 'turquoise',
    name: 'Turquoise',
    colors: {
      light: { bead: '#2aa6a0', beadEdge: '#136461', ...GOLD, tassel: '#b8902a', rope: '#7fb0ad' },
      dark: { bead: '#3cc4bd', beadEdge: '#136461', ...GOLD, tassel: '#d4af37', rope: '#4a7a77' },
    },
  },
  {
    id: 'pearl',
    name: 'Pearl',
    colors: {
      light: { bead: '#ece6d6', beadEdge: '#b3a98c', ...GOLD, tassel: '#c9bfa3', rope: '#b3a98c' },
      dark: { bead: '#e8e2d2', beadEdge: '#8f8669', ...GOLD, tassel: '#e8e2d2', rope: '#6b6657' },
    },
  },
];

export const DEFAULT_SKIN: MalaSkin = MALA_SKINS[0]!;

export function getSkin(id: string): MalaSkin {
  return MALA_SKINS.find((skin) => skin.id === id) ?? DEFAULT_SKIN;
}

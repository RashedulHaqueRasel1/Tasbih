const light = {
  text: '#3a2f22',
  textSecondary: '#7a6a55',
  background: '#efe6d6',
  surface: '#e0d4bd',
  surfaceSelected: '#d3c5a8',
  accent: '#8a3b1f',
  gold: '#b8902a',
  danger: '#b3392b',
} as const;

const dark = {
  text: '#f1e6d0',
  textSecondary: '#a89880',
  background: '#17120e',
  surface: '#2a221b',
  surfaceSelected: '#3a3025',
  accent: '#e0a35a',
  gold: '#d4af37',
  danger: '#e0705f',
} as const;

export type ColorToken = keyof typeof light;
export type ColorPalette = Record<ColorToken, string>;
export type ColorSchemeName = 'light' | 'dark';

export const palettes: Record<ColorSchemeName, ColorPalette> = { light, dark };

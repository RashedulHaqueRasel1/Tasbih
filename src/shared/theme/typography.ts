import type { TextStyle } from 'react-native';

import { fontFamily } from './fonts';

export type TextVariant =
  'body' | 'caption' | 'captionBold' | 'title' | 'headline' | 'arabic' | 'bangla';

export const typography: Record<TextVariant, TextStyle> = {
  body: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
  caption: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  captionBold: { fontSize: 14, lineHeight: 20, fontWeight: '700' },
  headline: { fontSize: 24, lineHeight: 32, fontWeight: '600' },
  title: { fontSize: 36, lineHeight: 42, fontWeight: '600' },
  arabic: { fontFamily: fontFamily.arabic, fontSize: 32, lineHeight: 52, fontWeight: '400' },
  bangla: { fontFamily: fontFamily.bangla, fontSize: 14, lineHeight: 22, fontWeight: '400' },
};

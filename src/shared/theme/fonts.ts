import { Amiri_400Regular } from '@expo-google-fonts/amiri';
import { ArefRuqaa_700Bold } from '@expo-google-fonts/aref-ruqaa';
import { Cinzel_600SemiBold } from '@expo-google-fonts/cinzel';
import { HindSiliguri_400Regular, HindSiliguri_500Medium } from '@expo-google-fonts/hind-siliguri';
import { TiroBangla_400Regular } from '@expo-google-fonts/tiro-bangla';

export const fontFamily = {
  arabic: 'Amiri_400Regular',
  bangla: 'HindSiliguri_400Regular',
  banglaMedium: 'HindSiliguri_500Medium',
  brandLatin: 'Cinzel_600SemiBold',
  brandBangla: 'TiroBangla_400Regular',
  brandArabic: 'ArefRuqaa_700Bold',
} as const;

/** Pass to `useFonts` once at the app root. */
export const fontAssets = {
  Amiri_400Regular,
  HindSiliguri_400Regular,
  HindSiliguri_500Medium,
  Cinzel_600SemiBold,
  TiroBangla_400Regular,
  ArefRuqaa_700Bold,
};

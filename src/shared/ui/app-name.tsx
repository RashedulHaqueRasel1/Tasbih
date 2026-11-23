import type { TextStyle } from 'react-native';

import { useI18n, type Language } from '@/shared/i18n';
import { fontFamily } from '@/shared/theme';

import { AppText, type AppTextProps } from './app-text';

/** Each language gets a display face that suits its script. */
const BRAND_STYLE: Record<Language, TextStyle> = {
  en: { fontFamily: fontFamily.brandLatin, letterSpacing: 3 },
  bn: { fontFamily: fontFamily.brandBangla },
  ar: { fontFamily: fontFamily.brandArabic },
};

type AppNameProps = Omit<AppTextProps, 'children'> & { size?: number };

/** The app name, set in a decorative font for the current language. */
export function AppName({ size = 26, style, color = 'accent', ...rest }: AppNameProps) {
  const { t, language } = useI18n();

  return (
    <AppText
      color={color}
      style={[BRAND_STYLE[language], { fontSize: size, lineHeight: size * 1.5 }, style]}
      {...rest}>
      {t('app.name')}
    </AppText>
  );
}

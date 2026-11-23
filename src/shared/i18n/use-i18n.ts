import { useMemo } from 'react';

import { useLanguageStore } from './language-store';
import { isRtl, type Language } from './languages';
import { localizeDigits } from './localize-digits';
import { translate, type TranslationParams } from './translate';
import type { TranslationKey } from './translations/en';

export type I18n = {
  language: Language;
  isRTL: boolean;
  t: (key: TranslationKey, params?: TranslationParams) => string;
  /** Writes digits the way the language does (Bangla and Arabic digits). */
  n: (value: number | string) => string;
};

export function useI18n(): I18n {
  const language = useLanguageStore((s) => s.language);

  return useMemo(
    () => ({
      language,
      isRTL: isRtl(language),
      t: (key, params) => translate(language, key, params),
      n: (value) => localizeDigits(String(value), language),
    }),
    [language],
  );
}

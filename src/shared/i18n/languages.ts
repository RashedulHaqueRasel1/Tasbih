export type Language = 'bn' | 'en' | 'ar';

export type LanguageInfo = {
  code: Language;
  /** Name written in the language itself. */
  nativeName: string;
  englishName: string;
  rtl: boolean;
};

export const LANGUAGES: readonly LanguageInfo[] = [
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bangla', rtl: false },
  { code: 'en', nativeName: 'English', englishName: 'English', rtl: false },
  { code: 'ar', nativeName: 'العربية', englishName: 'Arabic', rtl: true },
];

export const DEFAULT_LANGUAGE: Language = 'en';

export function isRtl(language: Language): boolean {
  return language === 'ar';
}

/** Picks a starting language from the device locale (e.g. "bn-BD" gives Bangla). */
export function detectLanguage(): Language {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();
    if (locale.startsWith('bn')) {
      return 'bn';
    }
    if (locale.startsWith('ar')) {
      return 'ar';
    }
  } catch {
    // Intl can be missing on some engines; fall back to the default.
  }
  return DEFAULT_LANGUAGE;
}

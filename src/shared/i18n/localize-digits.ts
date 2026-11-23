import type { Language } from './languages';

const DIGITS: Record<Language, string> = {
  en: '0123456789',
  bn: '০১২৩৪৫৬৭৮৯',
  ar: '٠١٢٣٤٥٦٧٨٩',
};

/** Swaps 0-9 for the digits of the language (Bangla, Arabic-Indic). Other characters stay. */
export function localizeDigits(text: string, language: Language): string {
  if (language === 'en') {
    return text;
  }
  const digits = [...DIGITS[language]];
  return text.replace(/[0-9]/g, (digit) => digits[Number(digit)] ?? digit);
}

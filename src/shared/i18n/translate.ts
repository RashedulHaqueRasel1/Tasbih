import type { Language } from './languages';
import { localizeDigits } from './localize-digits';
import { ar } from './translations/ar';
import { bn } from './translations/bn';
import { en, type Dictionary, type TranslationKey } from './translations/en';

const dictionaries: Record<Language, Dictionary> = { en, bn, ar };

export type TranslationParams = Record<string, string | number>;

/**
 * Looks up `key` and fills `{name}` placeholders. Numbers are written with the digits of the
 * language; strings (names the user typed) are inserted as they are.
 */
export function translate(
  language: Language,
  key: TranslationKey,
  params?: TranslationParams,
): string {
  const template = dictionaries[language][key] ?? en[key];
  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) => {
    const value = params?.[name];
    if (value === undefined) {
      return placeholder;
    }
    return typeof value === 'number' ? localizeDigits(String(value), language) : value;
  });
}

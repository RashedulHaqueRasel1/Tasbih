import { localizeDigits } from './localize-digits';
import { translate } from './translate';
import { ar } from './translations/ar';
import { bn } from './translations/bn';
import { en } from './translations/en';

describe('localizeDigits', () => {
  it('leaves English digits alone', () => {
    expect(localizeDigits('33', 'en')).toBe('33');
  });

  it('writes Bangla and Arabic digits and keeps other characters', () => {
    expect(localizeDigits('1,024 x', 'bn')).toBe('১,০২৪ x');
    expect(localizeDigits('305', 'ar')).toBe('٣٠٥');
  });
});

describe('translate', () => {
  it('fills placeholders and localizes number params', () => {
    expect(translate('en', 'counter.of', { target: 33 })).toBe('of 33');
    expect(translate('bn', 'counter.of', { target: 33 })).toBe('৩৩ এর মধ্যে');
    expect(translate('ar', 'counter.round', { round: 2 })).toBe('الجولة ٢');
  });

  it('keeps text params (user typed names) as they are', () => {
    expect(translate('bn', 'chain.summary', { name: 'Fajr 33', taps: 5 })).toBe('Fajr 33 · ৫ বার');
  });

  it('leaves unknown placeholders visible instead of failing', () => {
    expect(translate('en', 'counter.of')).toBe('of {target}');
  });
});

describe('dictionaries', () => {
  it('have the same keys in every language, with no empty text', () => {
    const keys = Object.keys(en).sort();
    expect(Object.keys(bn).sort()).toEqual(keys);
    expect(Object.keys(ar).sort()).toEqual(keys);
    for (const dictionary of [en, bn, ar]) {
      expect(Object.values(dictionary).every((text) => text.trim() !== '')).toBe(true);
    }
  });

  it('use the same placeholders in every language', () => {
    const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort().join();
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(placeholders(bn[key])).toBe(placeholders(en[key]));
      expect(placeholders(ar[key])).toBe(placeholders(en[key]));
    }
  });
});

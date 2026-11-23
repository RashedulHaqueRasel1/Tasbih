import type { Language } from '@/shared/i18n';

import type { Dhikr } from '../types';

/** Names of the preset dhikr in Bangla and Arabic. English uses the transliteration. */
const PRESET_NAMES: Record<string, { bn: string; ar: string }> = {
  alhamdulillah: { bn: 'আলহামদুলিল্লাহ', ar: 'الحمد لله' },
  subhanallah: { bn: 'সুবহানাল্লাহ', ar: 'سبحان الله' },
  'allahu-akbar': { bn: 'আল্লাহু আকবার', ar: 'الله أكبر' },
  astaghfirullah: { bn: 'আস্তাগফিরুল্লাহ', ar: 'أستغفر الله' },
  'la-ilaha-illallah': { bn: 'লা ইলাহা ইল্লাল্লাহ', ar: 'لا إله إلا الله' },
  durood: { bn: 'দুরূদ', ar: 'الصلاة على النبي' },
  hasbunallah: { bn: 'হাসবুনাল্লাহ', ar: 'حسبنا الله' },
  'subhanallahi-wa-bihamdihi': { bn: 'সুবহানাল্লাহি ওয়া বিহামদিহি', ar: 'سبحان الله وبحمده' },
  'subhanallahil-azim': { bn: 'সুবহানাল্লাহিল আজিম', ar: 'سبحان الله العظيم' },
  'baqiyat-salihat': { bn: 'বাকিয়াতুস সালিহাত', ar: 'الباقيات الصالحات' },
  'la-hawla': { bn: 'লা হাওলা ওয়ালা কুওয়াতা', ar: 'لا حول ولا قوة إلا بالله' },
  'kalima-tayyiba': { bn: 'কালিমা তাইয়্যিবা', ar: 'كلمة الطيبة' },
  tahlil: { bn: 'তাহলিল', ar: 'التهليل' },
  'astaghfirullah-wa-atubu': { bn: 'আস্তাগফিরুল্লাহ ওয়া আতুবু ইলাইহি', ar: 'أستغفر الله وأتوب إليه' },
  rabbighfirli: { bn: 'রাব্বিগফির লী', ar: 'رب اغفر لي' },
  salawat: { bn: 'সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম', ar: 'صلى الله عليه وسلم' },
  'dua-yunus': { bn: 'দোয়া ইউনুস', ar: 'دعاء يونس' },
  'ya-hayyu-ya-qayyum': { bn: 'ইয়া হাইয়্যু ইয়া কাইয়্যুম', ar: 'يا حي يا قيوم' },
  hasbiyallahu: { bn: 'হাসবিয়াল্লাহু', ar: 'حسبي الله' },
};

/** The name to show for a dhikr. Custom dhikr keep whatever the user typed. */
export function dhikrName(dhikr: Dhikr, language: Language): string {
  if (dhikr.isCustom || language === 'en') {
    return dhikr.transliteration;
  }
  return PRESET_NAMES[dhikr.id]?.[language] ?? dhikr.transliteration;
}

/**
 * The meaning to show. Bangla falls back to the English meaning for custom dhikr; Arabic users
 * read the Arabic text itself, so no translation is shown.
 */
export function dhikrMeaning(dhikr: Dhikr, language: Language): string {
  if (language === 'ar') {
    return '';
  }
  return language === 'bn' ? dhikr.meaningBn || dhikr.meaning : dhikr.meaning;
}

/**
 * In Arabic the vocalized Arabic text is already the name, so repeating the name under it
 * would only duplicate it.
 */
export function showsNameLine(dhikr: Dhikr, language: Language): boolean {
  return !(language === 'ar' && dhikr.arabic !== '');
}

/**
 * The landing page appears before the user has picked a language, so it greets in all three at
 * once instead of going through the translations.
 */
export const WELCOME_TEXT = {
  bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  center: 'سُبْحَانَ اللَّهِ',
  title: 'Tasbih',
  titleLine: 'তাসবিহ · تسبيح',
  taglines: [
    { language: 'en', text: 'Your calm, offline dhikr companion' },
    { language: 'bn', text: 'আপনার শান্ত, অফলাইন জিকিরের সঙ্গী' },
    { language: 'ar', text: 'رفيقك الهادئ للذكر، بلا إنترنت' },
  ],
  start: 'Get started  ·  শুরু করুন  ·  ابدأ',
} as const;

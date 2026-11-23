import { Redirect, useRouter } from 'expo-router';

import { WelcomeScreen } from '@/features/welcome';
import { useStoreHydrated } from '@/shared/hooks/use-store-hydrated';
import { useLanguageStore } from '@/shared/i18n';

export default function Index() {
  const router = useRouter();
  const hydrated = useStoreHydrated(useLanguageStore);
  const chosen = useLanguageStore((s) => s.chosen);

  // Returning users go straight to the counter; only first run sees the landing page.
  if (hydrated && chosen) {
    return <Redirect href="/counter" />;
  }

  return <WelcomeScreen onStart={() => router.push('/language')} />;
}

import { useRouter } from 'expo-router';

import { LanguageScreen } from '@/features/welcome';

export default function LanguageRoute() {
  const router = useRouter();

  return <LanguageScreen onContinue={() => router.replace('/counter')} />;
}

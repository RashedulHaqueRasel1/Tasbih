import { useRouter } from 'expo-router';

import { CounterScreen } from '@/features/counter';

export default function CounterRoute() {
  const router = useRouter();

  return (
    <CounterScreen
      onOpenSettings={() => router.push('/settings')}
      onOpenLibrary={() => router.push('/dhikr')}
      onOpenChains={() => router.push('/chains')}
      onOpenHistory={() => router.push('/history')}
    />
  );
}

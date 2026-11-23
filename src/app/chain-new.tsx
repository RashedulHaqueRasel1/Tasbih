import { useRouter } from 'expo-router';

import { AddChainScreen } from '@/features/chain';

export default function AddChainRoute() {
  const router = useRouter();

  return <AddChainScreen onSaved={() => router.back()} />;
}

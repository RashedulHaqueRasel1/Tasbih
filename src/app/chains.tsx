import { useRouter } from 'expo-router';

import { ChainsScreen, useChainStore } from '@/features/chain';

export default function ChainsRoute() {
  const router = useRouter();
  const startChain = useChainStore((s) => s.startChain);

  return (
    <ChainsScreen
      onStart={(chain) => {
        startChain(chain.id);
        router.back();
      }}
      onAdd={() => router.push('/chain-new')}
    />
  );
}

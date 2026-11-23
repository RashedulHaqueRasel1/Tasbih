import { useRouter } from 'expo-router';

import { useCounterStore } from '@/features/counter';
import { DhikrLibraryScreen } from '@/features/dhikr';

export default function DhikrRoute() {
  const router = useRouter();
  const activeDhikrId = useCounterStore((s) => s.activeDhikrId);
  const setActiveDhikr = useCounterStore((s) => s.setActiveDhikr);

  return (
    <DhikrLibraryScreen
      selectedId={activeDhikrId}
      onSelect={(dhikr) => {
        setActiveDhikr(dhikr.id, dhikr.defaultTarget);
        router.back();
      }}
      onAdd={() => router.push('/dhikr-new')}
    />
  );
}

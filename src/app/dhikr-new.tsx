import { useRouter } from 'expo-router';

import { AddDhikrScreen } from '@/features/dhikr';

export default function AddDhikrRoute() {
  const router = useRouter();

  return <AddDhikrScreen onSaved={() => router.back()} />;
}

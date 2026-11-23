import type { Chain } from '../types';

export const PRESET_CHAINS: readonly Chain[] = [
  {
    id: 'tasbih-e-fatima',
    name: 'Tasbih-e-Fatima',
    steps: [
      { dhikrId: 'subhanallah', target: 33 },
      { dhikrId: 'alhamdulillah', target: 33 },
      { dhikrId: 'allahu-akbar', target: 34 },
    ],
    isCustom: false,
  },
];

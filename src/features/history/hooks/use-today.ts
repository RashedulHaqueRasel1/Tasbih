import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import type { DateKey } from '../types';
import { msUntilNextDay, toDateKey } from '../utils/date-key';

/** Today's local date key. Rolls over at midnight and when the app returns to the foreground. */
export function useToday(): DateKey {
  const [today, setToday] = useState(() => toDateKey(new Date()));

  useEffect(() => {
    const refresh = () => setToday(toDateKey(new Date()));
    // Fire just after midnight; re-arms itself because `today` changes and re-runs this effect.
    const timer = setTimeout(refresh, msUntilNextDay(new Date()) + 500);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refresh();
      }
    });
    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, [today]);

  return today;
}

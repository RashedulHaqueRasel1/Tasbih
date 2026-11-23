import { useEffect, useRef, useState } from 'react';

import { isMilestone } from '../utils/counter-logic';

/**
 * Watches the count and, each time one more tap lands on a milestone, bumps the number it
 * returns so a flash can follow. (The buzz itself is played by the tap, see use-counter-session.)
 * Undo, reset and switching dhikr never trigger it.
 */
export function useMilestone(count: number, totalTaps: number): number {
  const [flash, setFlash] = useState(0);
  const previousTaps = useRef(totalTaps);

  useEffect(() => {
    const counted = totalTaps === previousTaps.current + 1;
    previousTaps.current = totalTaps;
    if (counted && isMilestone(count)) {
      setFlash((value) => value + 1);
    }
  }, [count, totalTaps]);

  return flash;
}

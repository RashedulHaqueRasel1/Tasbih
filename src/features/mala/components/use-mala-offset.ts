import { useEffect, useRef } from 'react';
import { useSharedValue, withSpring, type SharedValue } from 'react-native-reanimated';

/**
 * Animated bead offset that follows `totalTaps`: a single tap or undo springs one bead,
 * bigger jumps (reset, switching dhikr or chain step) snap straight to the new value.
 */
export function useMalaOffset(totalTaps: number): SharedValue<number> {
  const offset = useSharedValue(totalTaps);
  const previousTaps = useRef(totalTaps);

  useEffect(() => {
    const delta = totalTaps - previousTaps.current;
    previousTaps.current = totalTaps;
    offset.value =
      Math.abs(delta) <= 1 ? withSpring(totalTaps, { damping: 14, stiffness: 180 }) : totalTaps;
  }, [totalTaps, offset]);

  return offset;
}

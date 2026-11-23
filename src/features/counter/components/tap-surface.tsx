import { useCallback, useMemo, useState } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';

import { TapRipple, type RippleSpot } from './tap-ripple';

/** Distance in px a swipe must travel before it counts. */
const SWIPE_DISTANCE = 40;
/** Movement below this is still a tap. */
const TAP_SLOP = 12;

type TapSurfaceProps = {
  onCount: () => void;
  /** Called on a swipe up, the opposite of the swipe that counts. */
  onUndo: () => void;
  disabled?: boolean;
};

/**
 * Full-area count surface behind the screen content. One gesture counts once:
 * a tap, a swipe down (the way the strand beads move) or a swipe left (the way the oval beads
 * move at the front). Swiping up takes the last count back (undo), the exact reverse of swiping
 * down. Swiping right does nothing.
 *
 * Taps are handled here too (not by a nested Pressable) so a swipe can never also fire a click.
 */
export function TapSurface({ onCount, onUndo, disabled = false }: TapSurfaceProps) {
  const [ripples, setRipples] = useState<RippleSpot[]>([]);
  const dropRipple = useCallback(
    (id: number) => setRipples((list) => list.filter((spot) => spot.id !== id)),
    [],
  );
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onPanResponderTerminationRequest: () => false,
        onPanResponderRelease: (e, g) => {
          const isTap = Math.abs(g.dx) <= TAP_SLOP && Math.abs(g.dy) <= TAP_SLOP;
          const isSwipe = g.dy > SWIPE_DISTANCE || g.dx < -SWIPE_DISTANCE;
          const isUndo = g.dy < -SWIPE_DISTANCE && Math.abs(g.dy) > Math.abs(g.dx);
          if (isUndo) {
            onUndo();
            return;
          }
          if (isTap || isSwipe) {
            onCount();
            const { locationX: x, locationY: y } = e.nativeEvent;
            // Keep at most a few rings alive so fast tapping stays cheap.
            setRipples((list) => [...list.slice(-4), { id: (list.at(-1)?.id ?? 0) + 1, x, y }]);
          }
        },
      }),
    [onCount, onUndo, disabled],
  );

  return (
    <View
      accessible
      accessibilityRole="button"
      accessibilityLabel="Count"
      accessibilityHint="Double tap to add one"
      accessibilityState={{ disabled }}
      accessibilityActions={[{ name: 'activate' }]}
      onAccessibilityAction={(e) => {
        if (!disabled && e.nativeEvent.actionName === 'activate') {
          onCount();
        }
      }}
      style={StyleSheet.absoluteFill}
      {...panResponder.panHandlers}>
      {ripples.map((spot) => (
        <TapRipple key={spot.id} {...spot} onDone={dropRipple} />
      ))}
    </View>
  );
}

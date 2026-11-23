import { useState } from 'react';
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { radius, useTheme } from '@/shared/theme';

type Metrics = { content: number; layout: number; offset: number };

/**
 * Props to spread on a ScrollView/FlatList plus the numbers `Scrollbar` needs. The native
 * indicator is hidden because it fades out (and is thin on web); this one is always visible.
 */
export function useScrollbar() {
  const [metrics, setMetrics] = useState<Metrics>({ content: 0, layout: 0, offset: 0 });

  const listProps = {
    showsVerticalScrollIndicator: false,
    scrollEventThrottle: 16,
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = event.nativeEvent.contentOffset.y;
      setMetrics((m) => ({ ...m, offset }));
    },
    onContentSizeChange: (_width: number, content: number) =>
      setMetrics((m) => ({ ...m, content })),
    onLayout: (event: LayoutChangeEvent) => {
      const layout = event.nativeEvent.layout.height;
      setMetrics((m) => ({ ...m, layout }));
    },
  };

  return { listProps, metrics };
}

const THUMB_MIN = 40;

/** Vertical track and thumb along the end edge of a scrolling list. Hidden when nothing scrolls. */
export function Scrollbar({ metrics }: { metrics: Metrics }) {
  const theme = useTheme();
  const { content, layout, offset } = metrics;

  if (layout <= 0 || content <= layout + 1) {
    return null;
  }

  const thumb = Math.max(THUMB_MIN, (layout * layout) / content);
  const range = content - layout;
  const progress = Math.min(Math.max(offset / range, 0), 1);

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.track, { backgroundColor: theme.surface }]}>
      <View
        style={[
          styles.thumb,
          { height: thumb, top: progress * (layout - thumb), backgroundColor: theme.accent },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    end: 0,
    width: 6,
    borderRadius: radius.pill,
  },
  thumb: { position: 'absolute', start: 0, end: 0, borderRadius: radius.pill },
});

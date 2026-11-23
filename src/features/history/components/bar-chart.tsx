import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';

import { useI18n } from '@/shared/i18n';
import { useTheme } from '@/shared/theme';

import type { ChartDay } from '../types';

const HEIGHT = 180;
const LABEL_HEIGHT = 22;
const TOP_PAD = 8;
const PLOT_HEIGHT = HEIGHT - LABEL_HEIGHT - TOP_PAD;

type BarChartProps = {
  days: readonly ChartDay[];
  goal: number;
};

/** Daily totals as bars. Days that reached the goal turn gold; a dashed line marks the goal. */
export function BarChart({ days, goal }: BarChartProps) {
  const theme = useTheme();
  const { t } = useI18n();
  const [width, setWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  const max = Math.max(goal, ...days.map((day) => day.total), 1);
  const slot = days.length > 0 ? width / days.length : 0;
  const barWidth = Math.max(slot * 0.62, 2);
  const yFor = (value: number) => TOP_PAD + PLOT_HEIGHT * (1 - value / max);
  const summary = days.map((day) => `${day.key}: ${day.total}`).join(', ');

  return (
    <View
      onLayout={onLayout}
      accessible
      accessibilityRole="image"
      accessibilityLabel={t('history.chartLabel', { goal, summary })}
      style={styles.root}>
      {width > 0 && (
        <Svg width={width} height={HEIGHT}>
          <Line
            x1={0}
            x2={width}
            y1={yFor(goal)}
            y2={yFor(goal)}
            stroke={theme.textSecondary}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          {days.map((day, index) => {
            const barHeight = day.total > 0 ? Math.max((day.total / max) * PLOT_HEIGHT, 2) : 0;
            const x = index * slot + (slot - barWidth) / 2;
            return (
              <Rect
                key={day.key}
                x={x}
                y={TOP_PAD + PLOT_HEIGHT - barHeight}
                width={barWidth}
                height={barHeight}
                rx={Math.min(barWidth / 2, 6)}
                fill={day.total >= goal ? theme.gold : theme.accent}
              />
            );
          })}
          {days.map((day, index) =>
            day.label ? (
              <SvgText
                key={`${day.key}-label`}
                x={index * slot + slot / 2}
                y={HEIGHT - 6}
                fontSize={12}
                fill={theme.textSecondary}
                textAnchor="middle">
                {day.label}
              </SvgText>
            ) : null,
          )}
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { height: HEIGHT, alignSelf: 'stretch' },
});

import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { dhikrName, useAllDhikr } from '@/features/dhikr';
import { useStoreHydrated } from '@/shared/hooks/use-store-hydrated';
import { useI18n, type TranslationKey } from '@/shared/i18n';
import { spacing } from '@/shared/theme';
import { AppText, Chip, Screen, ScreenHeader, SegmentedControl, Surface } from '@/shared/ui';

import { BarChart } from '../components/bar-chart';
import { GoalProgressBar } from '../components/goal-progress-bar';
import { StatTile } from '../components/stat-tile';
import { useToday } from '../hooks/use-today';
import { useLogStore } from '../store/log-store';
import type { ChartRange } from '../types';
import { averagePerDay, chartDays } from '../utils/chart-data';
import {
  dayOf,
  dhikrBreakdown,
  dhikrBreakdownAll,
  goalProgress,
  lifetimeTotal,
  periodTotal,
} from '../utils/log-logic';
import { bestStreak, currentStreak } from '../utils/streak';

const GOAL_PRESETS = [33, 100, 300, 500, 1000, 3000] as const;

type Period = 'today' | 'week' | 'month' | 'all';
const PERIOD_DAYS: Record<Exclude<Period, 'all'>, number> = { today: 1, week: 7, month: 30 };

export function HistoryScreen() {
  const hydrated = useStoreHydrated(useLogStore);
  const today = useToday();
  const log = useLogStore((s) => s.log);
  const goal = useLogStore((s) => s.dailyGoal);
  const setDailyGoal = useLogStore((s) => s.setDailyGoal);
  const allDhikr = useAllDhikr();
  const { t, n, language } = useI18n();
  const [range, setRange] = useState<ChartRange>('week');
  const [period, setPeriod] = useState<Period>('all');

  const rangeOptions: readonly { value: ChartRange; label: string }[] = [
    { value: 'week', label: t('history.week') },
    { value: 'month', label: t('history.month') },
  ];
  const periodOptions: readonly { value: Period; label: string }[] = [
    { value: 'today', label: t('history.today') },
    { value: 'week', label: t('history.week') },
    { value: 'month', label: t('history.month') },
    { value: 'all', label: t('history.allTime') },
  ];

  const days = useMemo(() => {
    const weekdays = Array.from({ length: 7 }, (_, i) => t(`weekday.${i}` as TranslationKey));
    return chartDays(log, today, range, weekdays).map((day) => ({
      ...day,
      label: n(day.label),
    }));
  }, [log, today, range, t, n]);
  const breakdown = useMemo(
    () =>
      period === 'all' ? dhikrBreakdownAll(log) : dhikrBreakdown(log, today, PERIOD_DAYS[period]),
    [log, today, period],
  );
  const names = useMemo(
    () => new Map(allDhikr.map((dhikr) => [dhikr.id, dhikrName(dhikr, language)])),
    [allDhikr, language],
  );

  if (!hydrated) {
    return (
      <Screen>
        <ScreenHeader title={t('history.title')} />
      </Screen>
    );
  }

  const fmt = (value: number) => n(value.toLocaleString('en-US'));
  const todayTotal = dayOf(log, today).total;
  const rangeTotal = days.reduce((sum, day) => sum + day.total, 0);
  const breakdownSum = breakdown.reduce((sum, item) => sum + item.total, 0);
  const goalPresets = GOAL_PRESETS.includes(goal as (typeof GOAL_PRESETS)[number])
    ? GOAL_PRESETS
    : [...GOAL_PRESETS, goal].sort((a, b) => a - b);

  return (
    <Screen>
      <ScreenHeader title={t('history.title')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <AppText variant="captionBold" color="textSecondary">
            {t('history.overview')}
          </AppText>
          <View style={styles.grid}>
            <StatTile value={fmt(todayTotal)} label={t('history.today')} />
            <StatTile value={fmt(periodTotal(log, today, 7))} label={t('history.week')} />
          </View>
          <View style={styles.grid}>
            <StatTile value={fmt(periodTotal(log, today, 30))} label={t('history.month')} />
            <StatTile value={fmt(lifetimeTotal(log))} label={t('history.allTime')} />
          </View>
          <View style={styles.grid}>
            <StatTile value={n(currentStreak(log, goal, today))} label={t('history.streak')} />
            <StatTile value={n(bestStreak(log, goal))} label={t('history.best')} />
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="captionBold" color="textSecondary">
            {t('history.chartTitle')}
          </AppText>
          <SegmentedControl options={rangeOptions} value={range} onChange={setRange} />
          <BarChart days={days} goal={goal} />
          <AppText variant="caption" color="textSecondary">
            {t('history.totalPer', {
              total: fmt(rangeTotal),
              avg: fmt(averagePerDay(days)),
            })}
          </AppText>
          <AppText variant="caption" color="textSecondary">
            {t('history.chartHint')}
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText variant="captionBold" color="textSecondary">
            {t('history.byDhikr')}
          </AppText>
          <AppText variant="caption" color="textSecondary">
            {t('history.byDhikrHint')}
          </AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chips}>
              {periodOptions.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  selected={option.value === period}
                  onPress={() => setPeriod(option.value)}
                />
              ))}
            </View>
          </ScrollView>
          {breakdown.length === 0 ? (
            <AppText color="textSecondary">{t('history.empty')}</AppText>
          ) : (
            breakdown.map(({ dhikrId, total }) => (
              <Surface key={dhikrId} tone="surface" style={styles.breakdown}>
                <View style={styles.row}>
                  <AppText style={styles.name} numberOfLines={1}>
                    {names.get(dhikrId) ?? t('history.deleted')}
                  </AppText>
                  <AppText color="accent">{t('history.times', { count: fmt(total) })}</AppText>
                </View>
                <GoalProgressBar progress={goalProgress(total, breakdown[0]?.total ?? 1)} />
                <AppText variant="caption" color="textSecondary">
                  {n(Math.round((total / Math.max(breakdownSum, 1)) * 100))}%
                </AppText>
              </Surface>
            ))
          )}
        </View>

        <View style={styles.section}>
          <AppText variant="captionBold" color="textSecondary">
            {t('history.dailyGoal')}
          </AppText>
          <AppText variant="caption" color="textSecondary">
            {t('history.goalHint')}
          </AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chips}>
              {goalPresets.map((value) => (
                <Chip
                  key={value}
                  label={n(value)}
                  selected={value === goal}
                  onPress={() => setDailyGoal(value)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingBottom: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  grid: { flexDirection: 'row', gap: spacing.sm },
  section: { gap: spacing.sm },
  chips: { flexDirection: 'row', gap: spacing.sm },
  breakdown: { padding: spacing.md, borderRadius: 16, gap: spacing.xs },
  name: { flex: 1 },
});

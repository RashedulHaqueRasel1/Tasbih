import type { ChartDay, ChartRange, DailyLog, DateKey } from '../types';
import { addDays, fromDateKey } from './date-key';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export const RANGE_DAYS: Record<ChartRange, number> = { week: 7, month: 30 };

/** The last 7 or 30 days ending today, oldest first, with a label for the bars worth naming. */
export function chartDays(
  log: DailyLog,
  today: DateKey,
  range: ChartRange,
  weekdays: readonly string[] = WEEKDAYS,
): ChartDay[] {
  const count = RANGE_DAYS[range];
  const days: ChartDay[] = [];

  for (let i = count - 1; i >= 0; i -= 1) {
    const key = addDays(today, -i);
    const date = fromDateKey(key);
    const label =
      range === 'week'
        ? (weekdays[date.getDay()] ?? '')
        : i % 5 === 0 || i === count - 1
          ? String(date.getDate())
          : '';
    days.push({ key, total: log[key]?.total ?? 0, label });
  }
  return days;
}

export function averagePerDay(days: readonly ChartDay[]): number {
  if (days.length === 0) {
    return 0;
  }
  return Math.round(days.reduce((sum, day) => sum + day.total, 0) / days.length);
}

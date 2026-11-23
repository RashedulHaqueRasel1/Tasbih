import type { DailyLog, DateKey, DayLog } from '../types';
import { addDays } from './date-key';

export const EMPTY_DAY: DayLog = { total: 0, byDhikr: {} };

export function dayOf(log: DailyLog, key: DateKey): DayLog {
  return log[key] ?? EMPTY_DAY;
}

/**
 * Adds `delta` taps (negative for undo) of one dhikr to a day. Counts never go below zero and
 * a day that ends up empty is dropped from the log.
 */
export function applyDelta(log: DailyLog, key: DateKey, dhikrId: string, delta: number): DailyLog {
  const day = dayOf(log, key);
  const dhikrCount = Math.max(0, (day.byDhikr[dhikrId] ?? 0) + delta);
  const byDhikr = { ...day.byDhikr, [dhikrId]: dhikrCount };
  if (dhikrCount === 0) {
    delete byDhikr[dhikrId];
  }
  const total = Object.values(byDhikr).reduce((sum, value) => sum + value, 0);

  if (total === 0) {
    const { [key]: _removed, ...rest } = log;
    return rest;
  }
  return { ...log, [key]: { total, byDhikr } };
}

export function lifetimeTotal(log: DailyLog): number {
  return Object.values(log).reduce((sum, day) => sum + day.total, 0);
}

/** Taps per dhikr over the last `days` days ending at `today`, biggest first. */
export function dhikrBreakdown(
  log: DailyLog,
  today: DateKey,
  days: number,
): { dhikrId: string; total: number }[] {
  const totals: Record<string, number> = {};
  for (let i = 0; i < days; i += 1) {
    const day = log[addDays(today, -i)];
    if (!day) {
      continue;
    }
    for (const [dhikrId, count] of Object.entries(day.byDhikr)) {
      totals[dhikrId] = (totals[dhikrId] ?? 0) + count;
    }
  }
  return Object.entries(totals)
    .map(([dhikrId, total]) => ({ dhikrId, total }))
    .sort((a, b) => b.total - a.total);
}

/** Total taps over the last `days` days ending at `today`. */
export function periodTotal(log: DailyLog, today: DateKey, days: number): number {
  let total = 0;
  for (let i = 0; i < days; i += 1) {
    total += log[addDays(today, -i)]?.total ?? 0;
  }
  return total;
}

/** Taps per dhikr across the whole log, biggest first. */
export function dhikrBreakdownAll(log: DailyLog): { dhikrId: string; total: number }[] {
  const totals: Record<string, number> = {};
  for (const day of Object.values(log)) {
    for (const [dhikrId, count] of Object.entries(day.byDhikr)) {
      totals[dhikrId] = (totals[dhikrId] ?? 0) + count;
    }
  }
  return Object.entries(totals)
    .map(([dhikrId, total]) => ({ dhikrId, total }))
    .sort((a, b) => b.total - a.total);
}

/** 0 to 1, capped. A goal of 0 counts as no goal. */
export function goalProgress(total: number, goal: number): number {
  return goal > 0 ? Math.min(total / goal, 1) : 0;
}

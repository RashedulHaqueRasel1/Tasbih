import type { DailyLog, DateKey } from '../types';
import { addDays, fromDateKey, toDateKey } from './date-key';

const metGoal = (log: DailyLog, key: DateKey, goal: number) => {
  const total = log[key]?.total ?? 0;
  return total > 0 && total >= goal;
};

/**
 * Consecutive days that reached the goal, ending today. Today not being done yet does not break
 * the streak: it keeps counting from yesterday until the day is over.
 */
export function currentStreak(log: DailyLog, goal: number, today: DateKey): number {
  let key = metGoal(log, today, goal) ? today : addDays(today, -1);
  let streak = 0;
  while (metGoal(log, key, goal)) {
    streak += 1;
    key = addDays(key, -1);
  }
  return streak;
}

/** Longest run of consecutive goal days anywhere in the log. */
export function bestStreak(log: DailyLog, goal: number): number {
  const days = Object.keys(log)
    .filter((key) => metGoal(log, key, goal))
    .sort();

  let best = 0;
  let run = 0;
  let previous: DateKey | null = null;
  for (const key of days) {
    run = previous !== null && toDateKey(fromDateKey(addDays(previous, 1))) === key ? run + 1 : 1;
    best = Math.max(best, run);
    previous = key;
  }
  return best;
}

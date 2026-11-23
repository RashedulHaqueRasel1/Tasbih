import type { DailyLog } from '../types';
import { chartDays } from './chart-data';
import { addDays, msUntilNextDay, toDateKey } from './date-key';
import { applyDelta, dhikrBreakdown, goalProgress, lifetimeTotal } from './log-logic';
import { bestStreak, currentStreak } from './streak';

const day = (total: number): DailyLog[string] => ({ total, byDhikr: { a: total } });

describe('date-key', () => {
  it('formats local dates with padding', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('moves across month and year boundaries', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('counts the time left until local midnight', () => {
    expect(msUntilNextDay(new Date(2026, 10, 23, 23, 59, 0))).toBe(60_000);
  });
});

describe('applyDelta', () => {
  it('adds taps per dhikr and keeps the day total', () => {
    let log: DailyLog = {};
    log = applyDelta(log, '2026-11-23', 'a', 2);
    log = applyDelta(log, '2026-11-23', 'b', 3);
    expect(log['2026-11-23']).toEqual({ total: 5, byDhikr: { a: 2, b: 3 } });
  });

  it('undo takes taps back and never goes below zero', () => {
    let log = applyDelta({}, '2026-11-23', 'a', 1);
    log = applyDelta(log, '2026-11-23', 'a', -1);
    expect(log).toEqual({});
    expect(applyDelta(log, '2026-11-23', 'a', -1)).toEqual({});
  });

  it('does not change other days', () => {
    const log = applyDelta({ '2026-11-22': day(4) }, '2026-11-23', 'a', 1);
    expect(log['2026-11-22']).toEqual(day(4));
  });
});

describe('totals', () => {
  const log: DailyLog = {
    '2026-11-23': { total: 5, byDhikr: { a: 3, b: 2 } },
    '2026-11-22': { total: 4, byDhikr: { a: 4 } },
    '2026-11-01': { total: 10, byDhikr: { c: 10 } },
  };

  it('sums the lifetime total', () => {
    expect(lifetimeTotal(log)).toBe(19);
  });

  it('breaks a range down by dhikr, biggest first', () => {
    expect(dhikrBreakdown(log, '2026-11-23', 7)).toEqual([
      { dhikrId: 'a', total: 7 },
      { dhikrId: 'b', total: 2 },
    ]);
  });

  it('caps goal progress at 1 and ignores a zero goal', () => {
    expect(goalProgress(50, 100)).toBe(0.5);
    expect(goalProgress(500, 100)).toBe(1);
    expect(goalProgress(5, 0)).toBe(0);
  });
});

describe('streak', () => {
  const log: DailyLog = {
    '2026-11-23': day(120),
    '2026-11-22': day(100),
    '2026-11-21': day(100),
    '2026-11-19': day(100),
    '2026-11-18': day(100),
  };

  it('counts consecutive goal days ending today', () => {
    expect(currentStreak(log, 100, '2026-11-23')).toBe(3);
  });

  it('keeps yesterday’s streak while today is not done yet', () => {
    expect(currentStreak(log, 100, '2026-11-24')).toBe(3);
  });

  it('is zero after a missed day', () => {
    expect(currentStreak(log, 100, '2026-11-25')).toBe(0);
  });

  it('treats a day under the goal as a break', () => {
    expect(currentStreak({ ...log, '2026-11-22': day(99) }, 100, '2026-11-23')).toBe(1);
  });

  it('finds the best streak anywhere', () => {
    expect(bestStreak(log, 100)).toBe(3);
    expect(bestStreak({}, 100)).toBe(0);
  });
});

describe('chartDays', () => {
  it('returns 7 days ending today, oldest first, with weekday labels', () => {
    const days = chartDays({ '2026-11-23': day(9) }, '2026-11-23', 'week');
    expect(days).toHaveLength(7);
    expect(days[6]).toEqual({ key: '2026-11-23', total: 9, label: 'Mon' });
    expect(days[0]?.key).toBe('2026-11-17');
  });

  it('returns 30 days for a month with sparse labels', () => {
    const days = chartDays({}, '2026-11-23', 'month');
    expect(days).toHaveLength(30);
    expect(days.filter((d) => d.label).length).toBeLessThan(10);
  });
});

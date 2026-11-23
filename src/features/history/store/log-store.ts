import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { MAX_TARGET } from '@/shared/limits';
import { createDebouncedStorage } from '@/shared/storage';

import type { DailyLog } from '../types';
import { toDateKey } from '../utils/date-key';
import { applyDelta } from '../utils/log-logic';

export const DEFAULT_DAILY_GOAL = 100;

type LogStore = {
  log: DailyLog;
  dailyGoal: number;
  /** Adds (or with a negative delta, takes back) taps of one dhikr on today's date. */
  record: (dhikrId: string, delta: number) => void;
  setDailyGoal: (goal: number) => void;
};

export const useLogStore = create<LogStore>()(
  persist(
    (set, get) => ({
      log: {},
      dailyGoal: DEFAULT_DAILY_GOAL,
      record: (dhikrId, delta) =>
        set({ log: applyDelta(get().log, toDateKey(new Date()), dhikrId, delta) }),
      setDailyGoal: (goal) =>
        set({ dailyGoal: Math.min(Math.max(Math.floor(goal), 1), MAX_TARGET) }),
    }),
    {
      name: 'tasbih/log',
      version: 1,
      // Every tap changes the log, so writes are batched instead of hitting storage each time.
      storage: createDebouncedStorage(800),
      partialize: ({ log, dailyGoal }) => ({ log, dailyGoal }),
    },
  ),
);

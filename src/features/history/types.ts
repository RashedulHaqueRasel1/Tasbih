/** Local calendar day as `YYYY-MM-DD`. */
export type DateKey = string;

export type DayLog = {
  total: number;
  byDhikr: Record<string, number>;
};

export type DailyLog = Record<DateKey, DayLog>;

export type ChartRange = 'week' | 'month';

export type ChartDay = {
  key: DateKey;
  total: number;
  /** Short label under the bar, empty when the bar is not labelled. */
  label: string;
};

import { MiningLeaderboardTimeframe } from '../mining-leaderboard.enums';

export const calculateStartOfWeek = (date: Date) => {
  const dayOfWeek = date.getUTCDay();
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() - dayOfWeek + 1,
      0,
      0,
      0,
      0
    )
  );
};

export const calculateEndOfWeek = (date: Date) => {
  const dayOfWeek = date.getUTCDay();
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() - dayOfWeek + 7,
      23,
      59,
      59,
      999
    )
  );
};

export const calculateStartOfMonth = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();

  return new Date(Date.UTC(year, month, 1));
};

export const calculateEndOfMonth = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();

  return new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
};

export const calculateStartOfDay = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
};

export const calculateEndOfDay = (date: Date) => {
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  );
  return new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);
};

export const getStartDateByTimeframe = (dateRef: string | Date, timeframe: string) => {
  const date = typeof dateRef === 'string' ? new Date(dateRef) : dateRef;

  if (timeframe === MiningLeaderboardTimeframe.Daily) {
    return calculateStartOfDay(date);
  }

  if (timeframe === MiningLeaderboardTimeframe.Weekly) {
    return calculateStartOfWeek(date);
  }

  if (timeframe === MiningLeaderboardTimeframe.Monthly) {
    return calculateStartOfMonth(date);
  }

  throw new Error(`Unknown timeframe: ${timeframe}`);
};

export const getEndDateByTimeframe = (dateRef: string | Date, timeframe: string) => {
  const date = typeof dateRef === 'string' ? new Date(dateRef) : dateRef;

  if (timeframe === MiningLeaderboardTimeframe.Daily) {
    return calculateEndOfDay(date);
  }

  if (timeframe === MiningLeaderboardTimeframe.Weekly) {
    return calculateEndOfWeek(date);
  }

  if (timeframe === MiningLeaderboardTimeframe.Monthly) {
    return calculateEndOfMonth(date);
  }

  throw new Error(`Unknown timeframe: ${timeframe}`);
};

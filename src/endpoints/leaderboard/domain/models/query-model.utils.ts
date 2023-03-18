import { MiningLeaderboardTimeframe } from '../mining-leaderboard.enums';

export const calculateStartOfWeek = (date: Date) => {
  const startOfWeek = new Date();
  const day = date.getDay();
  startOfWeek.setDate(date.getDate() - ((day < 1 ? 7 : 0) + day - 1));
  startOfWeek.setHours(1, 0, 0, 0);

  return startOfWeek;
};

export const calculateEndOfWeek = (date: Date) => {
  const startOfWeek = calculateStartOfWeek(date);
  const endOfWeek = new Date(
    startOfWeek.getFullYear(),
    startOfWeek.getMonth(),
    startOfWeek.getDate() + 6,
    24,
    59,
    59
  );
  return endOfWeek;
};

export const calculateStartOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1, 1, 0, 0, 0);
};

export const calculateEndOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 24, 59, 59);
};

export const calculateStartOfDay = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 1, 0, 0);
};

export const calculateEndOfDay = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 24, 59, 59);
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

import { MiningLeaderboardTimeframe } from '../mining-leaderboard.enums';

export const calculateStartOfWeek = (date: Date) => {
  const dayOfWeek = date.getDay();
  const cm = date.getMonth();
  const month = cm < 10 ? `0${cm}` : cm;
  const cd = date.getDate() - dayOfWeek + 1;
  const day = cd < 10 ? `0${cd}` : cd;

  return new Date(`${date.getFullYear()}-${month}-${day}T00:00:00.000Z`);
};

export const calculateEndOfWeek = (date: Date) => {
  const dayOfWeek = date.getDay();
  const cm = date.getMonth();
  const month = cm < 10 ? `0${cm}` : cm;
  const cd = date.getDate() - dayOfWeek + 7;
  const day = cd < 10 ? `0${cd}` : cd;

  return new Date(`${date.getFullYear()}-${month}-${day}T23:59:59.999Z`);
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
  const cm = date.getMonth();
  const month = cm < 10 ? `0${cm}` : cm;
  const cd = date.getDate();
  const day = cd < 10 ? `0${cd}` : cd;

  return new Date(`${date.getFullYear()}-${month}-${day}T00:00:00.000Z`);
};

export const calculateEndOfDay = (date: Date) => {
  const cm = date.getMonth();
  const month = cm < 10 ? `0${cm}` : cm;
  const cd = date.getDate();
  const day = cd < 10 ? `0${cd}` : cd;

  return new Date(`${date.getFullYear()}-${month}-${day}T23:59:59.999Z`);
};

export const getStartDateByTimeframe = (
  dateRef: string | Date,
  timeframe: string
): Date => {
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

export const getEndDateByTimeframe = (
  dateRef: string | Date,
  timeframe: string
): Date => {
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

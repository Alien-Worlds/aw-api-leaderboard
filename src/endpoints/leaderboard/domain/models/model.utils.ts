import { Leaderboard } from '../entities/leaderboard';
import { LeaderboardListOutputItem } from '../../data/leaderboard.dtos';
import { MiningLeaderboardTimeframe } from '../mining-leaderboard.enums';
import { buildConfig } from '../../../../config';
import { removeUndefinedProperties } from '@alien-worlds/api-core';

const config = buildConfig();

export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};

export const calculateStartOfWeek = (date: Date) => {
  const dayOfWeek = date.getDay();
  const year = date.getFullYear();
  const month = date.getMonth();
  const dayOfMonth = date.getDate();
  const tempFirstDayOfWeek = dayOfMonth - dayOfWeek + 1;

  let monthValue;
  let yearValue;
  let firstDayOfWeek;

  if (tempFirstDayOfWeek < 0 && month === 0) {
    monthValue = 11;
    yearValue = year - 1;
    const lastDayOfDecember = getDaysInMonth(monthValue, year - 1);

    firstDayOfWeek = lastDayOfDecember + tempFirstDayOfWeek;
  } else if (tempFirstDayOfWeek < 0 && month > 0) {
    yearValue = year;
    monthValue = month - 1;
    const lastDayOfPrevMonth = getDaysInMonth(monthValue, year);
    firstDayOfWeek = lastDayOfPrevMonth + tempFirstDayOfWeek;
  } else {
    yearValue = year;
    monthValue = month;
    firstDayOfWeek = tempFirstDayOfWeek;
  }

  monthValue += 1;
  const monthStr = monthValue < 10 ? `0${monthValue}` : monthValue;
  const dayStr = firstDayOfWeek < 10 ? `0${firstDayOfWeek}` : firstDayOfWeek;

  return new Date(`${yearValue}-${monthStr}-${dayStr}T00:00:00.000Z`);
};

export const calculateEndOfWeek = (date: Date) => {
  const dayOfWeek = date.getDay();
  const year = date.getFullYear();
  const month = date.getMonth();
  const dayOfMonth = date.getDate();
  const lastDayOfMonth = getDaysInMonth(month, year);
  const tempLastDayOfWeek = dayOfMonth - dayOfWeek + 7;

  let monthValue = month;
  let lastDayOfWeek = tempLastDayOfWeek;

  if (lastDayOfMonth < lastDayOfWeek) {
    monthValue += 1;
    lastDayOfWeek = tempLastDayOfWeek - lastDayOfMonth;
  }

  // index from 1
  monthValue += 1;

  const monthStr = monthValue < 10 ? `0${monthValue}` : monthValue;
  const dayStr = lastDayOfWeek < 10 ? `0${lastDayOfWeek}` : lastDayOfWeek;

  return new Date(`${year}-${monthStr}-${dayStr}T23:59:59.999Z`);
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
  const cm = date.getMonth() + 1;
  const month = cm < 10 ? `0${cm}` : cm;
  const cd = date.getDate();
  const day = cd < 10 ? `0${cd}` : cd;

  return new Date(`${date.getFullYear()}-${month}-${day}T00:00:00.000Z`);
};

export const calculateEndOfDay = (date: Date) => {
  const cm = date.getMonth() + 1;
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

export const parseLeaderboardToResult = (
  leaderboard: Leaderboard,
  sort: string,
): LeaderboardListOutputItem => {
  const {
    wallet_id,
    username,
    tlm_gains_total,
    tlm_gains_highest,
    total_nft_points,
    total_charge_time,
    avg_charge_time,
    total_mining_power,
    avg_mining_power,
    total_nft_power,
    avg_nft_power,
    lands_mined_on,
    planets_mined_on,
    unique_tools_used,
    rankings,
  } = leaderboard.toStruct();

  const { decimalPrecision } = config;

  const dto = {
    wallet_id,
    username,
    tlm_gains_total: Number(Number(tlm_gains_total) || 0).toFixed(decimalPrecision),
    tlm_gains_highest: Number(Number(tlm_gains_highest) || 0).toFixed(decimalPrecision),
    total_nft_points: Number(Number(total_nft_points) || 0).toFixed(decimalPrecision),
    total_charge_time,
    avg_charge_time: Number(Number(avg_charge_time) || 0).toFixed(decimalPrecision),
    total_mining_power,
    avg_mining_power: Number(Number(avg_mining_power) || 0).toFixed(decimalPrecision),
    total_nft_power,
    avg_nft_power: Number(Number(avg_nft_power) || 0).toFixed(decimalPrecision),
    lands_mined_on,
    planets_mined_on,
    unique_tools_used,
    position: rankings?.[sort] || -1,
  };

  return removeUndefinedProperties<LeaderboardListOutputItem>(dto);
};

import { LeaderboardListOutputItem } from '../data/leaderboard.dtos';
import { removeUndefinedProperties } from '@alien-worlds/api-core';
import { Leaderboard, preciseIntToFloat } from '@alien-worlds/leaderboard-api-common';

export const isIsoDateFormat = value => {
  return (
    typeof value === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)
  );
};

export const createTimeRange = (options: {
  date?: Date | string;
  fromDate?: Date | string;
  toDate?: Date | string;
}): { fromDate: Date; toDate: Date } => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  let fromDate = new Date(
    `${now.getFullYear()}-${month < 10 ? '0' + month : month}-${
      day < 10 ? '0' + day : day
    }T00:00:00.000Z`
  );
  let toDate = new Date(
    `${now.getFullYear()}-${month < 10 ? '0' + month : month}-${
      day < 10 ? '0' + day : day
    }T23:59:59.000Z`
  );

  if (options.date) {
    const dateRef =
      typeof options.date === 'string' ? new Date(options.date) : options.date;
    const day = dateRef.getDate();
    const month = dateRef.getMonth() + 1;
    fromDate = new Date(
      `${dateRef.getFullYear()}-${month < 10 ? '0' + month : month}-${
        day < 10 ? '0' + day : day
      }T00:00:00.000Z`
    );
    toDate = new Date(
      `${dateRef.getFullYear()}-${month < 10 ? '0' + month : month}-${
        day < 10 ? '0' + day : day
      }T23:59:59.000Z`
    );
  } else {
    if (options.fromDate && isIsoDateFormat(options.fromDate)) {
      fromDate = new Date(options.fromDate);
    } else if (options.fromDate && isIsoDateFormat(options.fromDate) === false) {
      const dateRef =
        typeof options.fromDate === 'string'
          ? new Date(options.fromDate)
          : options.fromDate;
      const day = dateRef.getDate();
      const month = dateRef.getMonth() + 1;
      fromDate = new Date(
        `${dateRef.getFullYear()}-${month < 10 ? '0' + month : month}-${
          day < 10 ? '0' + day : day
        }T00:00:00.000Z`
      );
    }

    if (options.toDate && isIsoDateFormat(options.fromDate)) {
      toDate = new Date(options.toDate);
    } else if (options.toDate && isIsoDateFormat(options.fromDate) === false) {
      const dateRef =
        typeof options.toDate === 'string' ? new Date(options.toDate) : options.toDate;
      const day = dateRef.getDate();
      const month = dateRef.getMonth() + 1;
      toDate = new Date(
        `${dateRef.getFullYear()}-${month < 10 ? '0' + month : month}-${
          day < 10 ? '0' + day : day
        }T23:59:59.000Z`
      );
    }
  }

  return { fromDate, toDate };
};

export const parseLeaderboardToResult = (
  leaderboard: Leaderboard,
  sort: string,
  tlmDecimalPrecision: number
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
    avg_tool_mining_power,
    avg_tool_nft_power,
    lands_mined_on,
    planets_mined_on,
    unique_tools_used,
    rankings,
  } = leaderboard.toJson();

  const dto = {
    wallet_id,
    username,
    tlm_gains_total: preciseIntToFloat(tlm_gains_total || 0, tlmDecimalPrecision),
    tlm_gains_highest: preciseIntToFloat(tlm_gains_highest || 0, tlmDecimalPrecision),
    total_nft_points,
    total_charge_time: Number(total_charge_time),
    avg_charge_time: Number((Number(avg_charge_time) || 0).toFixed(tlmDecimalPrecision)),
    total_mining_power: Number(total_mining_power),
    avg_mining_power: Number(
      (Number(avg_mining_power) || 0).toFixed(tlmDecimalPrecision)
    ),
    total_nft_power: Number(total_nft_power),
    avg_nft_power: Number((Number(avg_nft_power) || 0).toFixed(tlmDecimalPrecision)),
    avg_tool_mining_power: Number(
      (Number(avg_tool_mining_power) || 0).toFixed(tlmDecimalPrecision)
    ),
    avg_tool_nft_power: Number(
      (Number(avg_tool_nft_power) || 0).toFixed(tlmDecimalPrecision)
    ),
    lands_mined_on: Number(lands_mined_on),
    planets_mined_on: Number(planets_mined_on),
    unique_tools_used: Number(unique_tools_used),
    position: rankings?.[sort] || -1,
  };

  return removeUndefinedProperties<LeaderboardListOutputItem>(dto);
};

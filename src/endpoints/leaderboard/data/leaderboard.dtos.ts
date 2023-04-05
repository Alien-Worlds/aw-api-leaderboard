import { LeaderboardUpdateStruct } from '@alien-worlds/alienworlds-api-common';
import { MongoDB } from '@alien-worlds/api-core';

export type ListLeaderboardRequest = {
  timeframe?: string;
  sort?: string;
  offset?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  date?: string;
  order?: number;
};

export type FindUserInLeaderboardRequest = {
  timeframe?: string;
  sort?: string;
  user?: string;
  fromDate?: string;
  toDate?: string;
  date?: string;
};

export type LeaderboardNumbers = {
  tlm_gains_total?: number;
  total_nft_points?: number;
  unique_tools_used?: number;
  avg_charge_time?: number;
  avg_mining_power?: number;
  avg_nft_power?: number;
  lands_mined_on?: number;
  planets_mined_on?: number;
};

export type LeaderboardDocument = LeaderboardNumbers & {
  _id?: MongoDB.ObjectId;
  start_timestamp?: Date;
  end_timestamp?: Date;
  last_update_timestamp?: Date;
  last_update_hash?: string;
  wallet_id?: string;
  username?: string;
  tlm_gains_highest?: number;
  tools_used?: MongoDB.Long[];
  total_charge_time?: number;
  total_mining_power?: number;
  total_nft_power?: number;
  lands?: MongoDB.Long[];
  planets?: string[];
  rankings?: LeaderboardNumbers;
  [key: string]: unknown;
};

export type MinigToolData = {
  delay: number;
  ease: number;
  difficulty: number;
};

export type LeaderboardStruct = LeaderboardNumbers & {
  start_timestamp?: string;
  end_timestamp?: string;
  last_update_timestamp?: string;
  last_update_hash?: string;
  last_update_completed?: boolean;
  wallet_id?: string;
  username?: string;
  tlm_gains_highest?: number;
  tools_used?: string[];
  total_charge_time?: number;
  total_mining_power?: number;
  total_nft_power?: number;
  lands?: string[];
  planets?: string[];
  rankings?: LeaderboardNumbers;
  [key: string]: unknown;
};

export type LeaderboardUpdateDocument = LeaderboardUpdateStruct;
export type LeaderboardUserRankingsStruct = { [key: string]: LeaderboardNumbers };
export type LeaderboardUserScoresStruct = { [key: string]: LeaderboardNumbers };

export type LeaderboardListOutputItem = Pick<
  LeaderboardUpdateStruct,
  | 'wallet_id'
  | 'username'
  | 'tlm_gains_total'
  | 'tlm_gains_highest'
  | 'total_nft_points'
  | 'total_charge_time'
  | 'avg_charge_time'
  | 'total_mining_power'
  | 'avg_mining_power'
  | 'total_nft_power'
  | 'avg_nft_power'
  | 'lands_mined_on'
  | 'planets_mined_on'
  | 'unique_tools_used'
  | 'position'
>;

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

export type LeaderboardBaseDocument = {
  tlm_gains_total?: number;
  total_nft_points?: number;
  unique_tools_used?: number;
  avg_charge_time?: number;
  avg_mining_power?: number;
  avg_nft_power?: number;
  lands_mined_on?: number;
  planets_mined_on?: number;
};

export type LeaderboardDocument = LeaderboardBaseDocument & {
  _id?: MongoDB.ObjectId;
  block_number: MongoDB.Long;
  block_timesamp: Date;
  start_timestamp?: Date;
  end_timestamp?: Date;
  last_update_timestamp?: Date;
  last_update_hash?: string;
  last_update_completed?: boolean;
  wallet_id?: string;
  username?: string;
  tlm_gains_highest?: number;
  tools_used?: MongoDB.Long[];
  total_charge_time?: number;
  total_mining_power?: number;
  total_nft_power?: number;
  lands?: MongoDB.Long[];
  planets?: string[];
  mine_rating?: number;
  position?: number;
  [key: string]: unknown;
};

export type MinigToolData = {
  delay: number;
  ease: number;
  difficulty: number;
};

export type LeaderboardStruct = {
  block_number: string;
  block_timesamp: string;
  start_timestamp?: string;
  end_timestamp?: string;
  wallet_id?: string;
  username?: string;
  tlm_gains_total?: number;
  tlm_gains_highest?: number;
  total_nft_points?: number;
  total_charge_time?: number;
  avg_charge_time?: number;
  total_mining_power?: number;
  avg_mining_power?: number;
  total_nft_power?: number;
  avg_nft_power?: number;
  lands_mined_on?: number;
  planets_mined_on?: number;
  unique_tools_used?: number;
  mine_rating?: number;
  planets?: string[];
  lands?: string[];
  tools_used?: string[];
  last_update_timestamp?: string;
  last_update_hash?: string;
  last_update_completed?: boolean;
  position?: number;
  [key: string]: unknown;
};

export type LeaderboardUpdateDocuemnt = LeaderboardUpdateStruct;

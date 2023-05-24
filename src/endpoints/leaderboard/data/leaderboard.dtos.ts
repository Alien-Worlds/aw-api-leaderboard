import { LeaderboardUpdateJson } from '@alien-worlds/alienworlds-api-common';

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

export type LeaderboardListOutputItem = Pick<
  LeaderboardUpdateJson,
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

import {
  AtomicAssetsConfig,
  LeaderboardConfig,
} from '@alien-worlds/alienworlds-api-common';

export type LeaderboardApiConfig = LeaderboardConfig & {
  port: number;
  atomicassets: AtomicAssetsConfig;
  tlmDecimalPrecision?: number;
  secretKey?: string;
  expirationTime?: string;
  dailyArchiveCronTime?: string;
  weeklyArchiveCronTime?: string;
  monthlyArchiveCronTime?: string;
};

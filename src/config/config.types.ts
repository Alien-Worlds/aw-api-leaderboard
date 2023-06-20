import { AtomicAssetsConfig } from '@alien-worlds/atomicassets-api-common';
import { LeaderboardConfig } from '@alien-worlds/leaderboard-api-common';

export type Versions = {
  leaderboard: string;
  leaderboardUrlVersion: string;
  apiCore: string;
  atomicassetsApiCommon: string;
  leaderboardApiCommon: string;
};

export type LeaderboardApiConfig = LeaderboardConfig & {
  versions: Versions;
  port: number;
  atomicassets: AtomicAssetsConfig;
  tlmDecimalPrecision?: number;
  secretKey?: string;
  expirationTime?: string;
  maxAttemptsPerBatch?: number;
  dailyArchiveCronTime?: string;
  weeklyArchiveCronTime?: string;
  monthlyArchiveCronTime?: string;
  newRelic?: NewRelicConfig;
};

export type NewRelicConfig = {
  newRelicEnabled: boolean;
  appName: string;
  licenseKey: string;
};

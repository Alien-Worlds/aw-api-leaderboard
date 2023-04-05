import { AtomicAssetsApiConfig } from '@alien-worlds/alienworlds-api-common';
import { BroadcastConfig, MongoConfig, RedisConfig } from '@alien-worlds/api-core';

export type Environment = {
  MONGO_HOSTS?: string;
  MONGO_PORTS?: string;
  MONGO_USER?: string;
  MONGO_PASSWORD?: string;
  MONGO_SRV?: number;
  MONGO_SSL?: number;
  MONGO_REPLICA_SET?: string;
  MONGO_AUTH_MECHANISM?: string;
  MONGO_AUTH_SOURCE?: string;
  MONGO_DB_NAME?: string;
  REDIS_HOSTS?: string;
  REDIS_PORTS?: string;
  REDIS_USER?: string;
  REDIS_PASSWORD?: string;
  REDIS_IANA?: string;
  REDIS_DATABASE?: string;
  PORT?: string;
  TOKEN_SECRET_KEY?: string;
  TOKEN_EXPIRATION_TIME?: string;
  HISTORY_TOOLS_BROADCAST_HOST?: string;
  HISTORY_TOOLS_BROADCAST_PORT?: string;
  HISTORY_TOOLS_BROADCAST_DRIVER?: string;
  ATOMICASSETS_API_HOST?: string;
  ATOMICASSETS_API_PORT?: string;
  ATOMICASSETS_API_SECURE?: string;
  CHECK_AND_UPDATE_BATCH_SIZE?: string;
  CHECK_AND_UPDATE_CRON_TIME?: string;
  ARCHIVE_BATCH_SIZE?: string;
  DAILY_ARCHIVE_CRON_TIME?: string;
  WEEKLY_ARCHIVE_CRON_TIME?: string;
  MONTHLY_ARCHIVE_CRON_TIME?: string;
};

export type ApiConfig = {
  port: number;
  secretKey: string;
  expirationTime: string;
};

export type LeaderboardConfig = {
  api: ApiConfig;
  mongo: MongoConfig;
  redis: RedisConfig;
  historyToolsBroadcast: BroadcastConfig;
  atomicassets: AtomicAssetsApiConfig;
  checkAndUpdateBatchSize?: number;
  checkAndUpdateCronTime?: string;
  archiveBatchSize?: number;
  dailyArchiveCronTime?: string;
  weeklyArchiveCronTime?: string;
  monthlyArchiveCronTime?: string;
};

import { LeaderboardApiConfig } from './config.types';
import {
  ConfigVars,
  MongoConfig,
  RedisConfig,
  buildMongoConfig,
  buildRedisConfig,
} from '@alien-worlds/api-core';

import { AtomicAssetsConfig } from '@alien-worlds/alienworlds-api-common';

export const buildConfig = (): LeaderboardApiConfig => {
  const vars = new ConfigVars();
  const port = vars.getNumberEnv('LEADERBOARD_API_PORT');
  const secretKey = vars.getStringEnv('LEADERBOARD_API_TOKEN_SECRET_KEY');
  const expirationTime = vars.getStringEnv('LEADERBOARD_API_TOKEN_EXPIRATION_TIME');
  const mongo: MongoConfig = buildMongoConfig(vars, 'LEADERBOARD_API');
  const redis: RedisConfig = buildRedisConfig(vars, 'LEADERBOARD_API');

  const atomicassets: AtomicAssetsConfig = {
    api: {
      host: vars.getStringEnv('ATOMIC_ASSETS_API_HOST'),
      port: vars.getNumberEnv('ATOMIC_ASSETS_API_PORT'),
      secure: vars.getBooleanEnv('ATOMIC_ASSETS_API_SECURE'),
    },
    mongo,
  };
  const dailyArchiveCronTime = vars.getStringEnv('DAILY_ARCHIVE_CRON_TIME');
  const weeklyArchiveCronTime = vars.getStringEnv('WEEKLY_ARCHIVE_CRON_TIME');
  const monthlyArchiveCronTime = vars.getStringEnv('MONTHLY_ARCHIVE_CRON_TIME');

  const archiveBatchSize = vars.getNumberEnv('ARCHIVE_BATCH_SIZE');
  const updateBatchSize = 1;
  const tlmDecimalPrecision = vars.getNumberEnv('TLM_DECIMAL_PRECISION') || 4;

  return {
    port,
    secretKey,
    expirationTime,
    mongo,
    redis,
    atomicassets,
    archiveBatchSize,
    updateBatchSize,
    dailyArchiveCronTime,
    weeklyArchiveCronTime,
    monthlyArchiveCronTime,
    tlmDecimalPrecision,
  };
};

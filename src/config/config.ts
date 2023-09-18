import { LeaderboardApiConfig, NewRelicConfig } from './config.types';
import { MongoConfig, buildMongoConfig } from '@alien-worlds/aw-storage-mongodb';
import { RedisConfig, buildRedisConfig } from '@alien-worlds/aw-storage-redis';

import { AtomicAssetsConfig } from '@alien-worlds/atomicassets-api-common';
import { ConfigVars } from '@alien-worlds/aw-core';
import { readFileSync } from 'fs';

export const buildConfig = (packageJsonPath: string): LeaderboardApiConfig => {
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
  const maxAttemptsPerBatch = vars.getNumberEnv('MAX_ATTEMPTS_PER_BATCH') || 10;

  const updateBatchSize = 1;
  const tlmDecimalPrecision = vars.getNumberEnv('TLM_DECIMAL_PRECISION') || 4;

  const newRelic: NewRelicConfig = {
    newRelicEnabled: vars.getBooleanEnv('NEW_RELIC_ENABLED'),
    appName: vars.getStringEnv('NEW_RELIC_APP_NAME') || `${process.env.npm_package_name}`,
    licenseKey: vars.getStringEnv('NEW_RELIC_LICENSE_KEY'),
  };

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const leaderboardMajor = Number(packageJson.version.split('.')[0]);
  const leaderboardUrlVersion = leaderboardMajor < 2 ? `v1` : `v${leaderboardMajor}`;

  const versions = {
    leaderboard: packageJson.version,
    leaderboardUrlVersion,
    apiCore: packageJson.dependencies['@alien-worlds/aw-core'],
    atomicassetsApiCommon:
      packageJson.dependencies['@alien-worlds/atomicassets-api-common'],
    leaderboardApiCommon:
      packageJson.dependencies['@alien-worlds/aw-api-common-leaderboard'],
  };

  return {
    versions,
    port,
    secretKey,
    expirationTime,
    mongo,
    redis,
    atomicassets,
    archiveBatchSize,
    maxAttemptsPerBatch,
    updateBatchSize,
    dailyArchiveCronTime,
    weeklyArchiveCronTime,
    monthlyArchiveCronTime,
    tlmDecimalPrecision,
    newRelic,
  };
};

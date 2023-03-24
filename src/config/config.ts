import { BroadcastConfig } from '@alien-worlds/api-core';
import { MongoConfig, RedisConfig } from '@alien-worlds/api-core';
import { readEnvFile } from './config.utils';
import { Environment, LeaderboardConfig, ApiConfig } from './config.types';
import { AtomicAssetsApiConfig } from '@alien-worlds/alienworlds-api-common';

export const buildConfig = (): LeaderboardConfig => {
  const environment: Environment = { ...process.env } as Environment;
  const dotEnv = readEnvFile();

  const api: ApiConfig = {
    port: Number(environment.PORT || dotEnv.PORT),
    secretKey: environment.TOKEN_SECRET_KEY || dotEnv.TOKEN_SECRET_KEY,
    expirationTime: environment.TOKEN_EXPIRATION_TIME || dotEnv.TOKEN_EXPIRATION_TIME,
  };

  const mongo: MongoConfig = {
    hosts: (environment.MONGO_HOSTS || dotEnv.MONGO_HOSTS).split(/,\s*/),
    ports: (environment.MONGO_PORTS || dotEnv.MONGO_PORTS).split(/,\s*/),
    database: environment.MONGO_DB_NAME || dotEnv.MONGO_DB_NAME,
    user: environment.MONGO_USER || dotEnv.MONGO_USER,
    password: environment.MONGO_PASSWORD || dotEnv.MONGO_PASSWORD,
    srv: Boolean(Number(environment.MONGO_SRV || dotEnv.MONGO_SRV)),
    ssl: Boolean(Number(environment.MONGO_SSL || dotEnv.MONGO_SSL)),
    replicaSet: environment.MONGO_REPLICA_SET || dotEnv.MONGO_REPLICA_SET,
    authMechanism: environment.MONGO_AUTH_MECHANISM || dotEnv.MONGO_AUTH_MECHANISM,
    authSource: environment.MONGO_AUTH_SOURCE || dotEnv.MONGO_AUTH_SOURCE,
  };

  const redis: RedisConfig = {
    hosts: (environment.REDIS_HOSTS || dotEnv.REDIS_HOSTS).split(/,\s*/),
    ports: (environment.REDIS_PORTS || dotEnv.REDIS_PORTS).split(/,\s*/),
    database: environment.REDIS_DATABASE || dotEnv.REDIS_DATABASE,
    user: environment.REDIS_USER || dotEnv.REDIS_USER,
    password: environment.REDIS_PASSWORD || dotEnv.REDIS_PASSWORD,
    iana: Boolean(Number(environment.REDIS_IANA || dotEnv.REDIS_IANA)),
  };

  const historyToolsBroadcast: BroadcastConfig = {
    host: environment.HISTORY_TOOLS_BROADCAST_HOST || dotEnv.HISTORY_TOOLS_BROADCAST_HOST,
    port: Number(
      environment.HISTORY_TOOLS_BROADCAST_PORT || dotEnv.HISTORY_TOOLS_BROADCAST_PORT
    ),
    driver:
      environment.HISTORY_TOOLS_BROADCAST_DRIVER || dotEnv.HISTORY_TOOLS_BROADCAST_DRIVER,
  };

  const atomicassets: AtomicAssetsApiConfig = {
    host: environment.ATOMICASSETS_API_HOST || dotEnv.ATOMICASSETS_API_HOST,
    port: Number(environment.ATOMICASSETS_API_PORT || dotEnv.ATOMICASSETS_API_PORT),
    secure: Boolean(
      Number(environment.ATOMICASSETS_API_SECURE || dotEnv.ATOMICASSETS_API_SECURE)
    ),
  };

  const cronTime = environment.CRON_TIME || dotEnv.CRON_TIME;
  const updateBatchSize =
    Number(environment.UPDATE_BATCH_SIZE || dotEnv.UPDATE_BATCH_SIZE) || 0;

  return {
    api,
    mongo,
    redis,
    historyToolsBroadcast: historyToolsBroadcast.host ? historyToolsBroadcast : null,
    atomicassets,
    cronTime,
    updatesBatchSize: updateBatchSize,
  };
};

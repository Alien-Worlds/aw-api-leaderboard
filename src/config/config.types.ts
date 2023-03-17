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
  HISTORY_TOOLS_BROADCAST_HOST?: string;
  HISTORY_TOOLS_BROADCAST_PORT?: string;
  HISTORY_TOOLS_BROADCAST_DRIVER?: string;
  ATOMICASSETS_API_HOST?: string;
  ATOMICASSETS_API_PORT?: string;
  ATOMICASSETS_API_SECURE?: number;
};

export type ApiConfig = {
  port: number;
};

export type LeaderboardConfig = {
  api: ApiConfig;
  mongo: MongoConfig;
  redis: RedisConfig;
  historyToolsBroadcast: BroadcastConfig;
  atomicassets: AtomicAssetsApiConfig;
};

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
  BROADCAST_URL?: string;
  BROADCAST_HOST?: string;
  BROADCAST_PORT?: string;
  BROADCAST_DRIVER?: string;
};

export type ApiConfig = {
  port: number;
};

export type LeaderboardConfig = {
  api: ApiConfig;
  mongo: MongoConfig;
  redis: RedisConfig;
  broadcast: BroadcastConfig;
};

import { MongoConfig } from "@alien-worlds/api-core";

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
};

export type RedisConfig = {
  hosts: string[];
  ports: string[];
  iana?: boolean;
  user?: string;
  password?: string;
  database?: string | number;
};

export type LeaderboardApiConfig = {
  port: number;
  mongo: MongoConfig;
  redis: RedisConfig;
};

import * as redis from 'redis';
import { log } from '@alien-worlds/api-core';
import { RedisUtils } from '../../../../utils';
import { RedisConfig } from '../../../../config/config.types';

export type RedisClientType = ReturnType<typeof redis.createClient>;

export class RedisSource {
  public static async create(config: RedisConfig): Promise<RedisSource> {
    const url = RedisUtils.buildRedisUrl(config);
    const client = redis.createClient({ url });

    client.on('error', error => log(`[Redis] Error : ${error}`));
    await client.connect();
    return new RedisSource(client);
  }

  private constructor(public readonly client: RedisClientType) {}
}

import { CollectionRedisSource, RedisSource } from '@alien-worlds/api-core';
import { LeaderboardStruct } from './../leaderboard.dtos';

/**
 * @class
 */
export class LeaderboardRedisSource extends CollectionRedisSource<LeaderboardStruct> {
  public static Token = 'LEADERBOARD_REDIS_SOURCE';

  /**
   * @constructor
   * @param {RedisSource} redisSource
   */
  constructor(redisSource: RedisSource, name: string) {
    super(redisSource, name);
  }
}

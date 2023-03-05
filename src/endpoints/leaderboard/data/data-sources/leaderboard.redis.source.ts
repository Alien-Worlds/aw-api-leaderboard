import { LeaderboardDocument, LeaderboardStruct } from './../leaderboard.dtos';
import { RedisSource } from './redis.source';

/**
 * @class
 */
export class LeaderboardRedisSource {
  public static Token = 'LEADERBOARD_REDIS_SOURCE';

  /**
   * @constructor
   * @param {RedisSource} redisSource
   */
  constructor(private readonly redisSource: RedisSource, private readonly name: string) {}

  public add(data: LeaderboardStruct) {
    this.redisSource.client.zAdd(this.name, { score: 1, value: '' });
  }

  public list(data: LeaderboardStruct) {
    this.redisSource.client.zAdd(this.name, { score: 1, value: '' });
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { CollectionMongoSource, MongoSource } from '@alien-worlds/api-core';
import { LeaderboardUpdateDocuemnt } from '../leaderboard.dtos';

/**
 * @class
 */
export class LeaderboardCacheMongoSource extends CollectionMongoSource<LeaderboardUpdateDocuemnt> {
  public static Token = 'LEADERBOARD_CACHE_MONGO_SOURCE';

  /**
   * @constructor
   * @param {MongoSource} mongoSource
   */
  constructor(mongoSource: MongoSource, name: string) {
    super(mongoSource, `leaderboard_cache`, {
      indexes: [{ key: { wallet_id: 1 }, background: true }],
    });
  }
}

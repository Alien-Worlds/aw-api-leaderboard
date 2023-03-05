import { CollectionMongoSource, MongoSource } from '@alien-worlds/api-core';
import { LeaderboardDocument } from '../leaderboard.dtos';

/**
 * @class
 */
export class LeaderboardMongoSource extends CollectionMongoSource<LeaderboardDocument> {
  public static Token = 'LEADERBOARD_MONGO_SOURCE';

  /**
   * @constructor
   * @param {MongoSource} mongoSource
   */
  constructor(mongoSource: MongoSource, name: string) {
    const parsedName = name.replace(/[ -.]+/g, '_');
    if (/^[a-zA-Z0-9_]+$/.test(parsedName) === false) {
      throw new Error(
        `Invalid leaderboard collection name "${name}". Please use only: a-zA-Z0-9_`
      );
    }
    super(mongoSource, `mining_leaderboard_${name}`, {
      indexes: [
        { key: { wallet_id: 1 }, background: true },
        { key: { username: 1 }, background: true },
        {
          key: { start_timestamp: 1, end_timestamp: 1, tlm_gains_total: 1 },
          background: true,
        },
        {
          key: { start_timestamp: 1, end_timestamp: 1, tlm_gains_highest: 1 },
          background: true,
        },
        {
          key: { start_timestamp: 1, end_timestamp: 1, total_nft_points: 1 },
          background: true,
        },
        {
          key: { start_timestamp: 1, end_timestamp: 1, avg_charge_time: 1 },
          background: true,
        },
        {
          key: { start_timestamp: 1, end_timestamp: 1, avg_mining_power: 1 },
          background: true,
        },
        {
          key: { start_timestamp: 1, end_timestamp: 1, avg_nft_power: 1 },
          background: true,
        },
        {
          key: { start_timestamp: 1, end_timestamp: 1, lands_mined_on: 1 },
          background: true,
        },
        {
          key: { start_timestamp: 1, end_timestamp: 1, planets_mined_on: 1 },
          background: true,
        },
        {
          key: { start_timestamp: 1, end_timestamp: 1, mine_rating: 1 },
          background: true,
        },
        {
          key: {
            wallet_id: 1,
            username: 1,
            start_timestamp: 1,
            end_timestamp: 1,
          },
          unique: true,
          background: true,
        },
      ],
    });
  }
}

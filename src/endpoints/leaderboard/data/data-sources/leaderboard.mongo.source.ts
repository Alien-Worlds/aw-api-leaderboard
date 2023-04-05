/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CollectionMongoSource,
  MongoSource,
  MongoDB,
  DataSourceOperationError,
} from '@alien-worlds/api-core';
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
          key: { tlm_gains_total: 1 },
          background: true,
        },
        {
          key: { tlm_gains_highest: 1 },
          background: true,
        },
        {
          key: { total_nft_points: 1 },
          background: true,
        },
        {
          key: { avg_charge_time: 1 },
          background: true,
        },
        {
          key: { avg_mining_power: 1 },
          background: true,
        },
        {
          key: { avg_nft_power: 1 },
          background: true,
        },
        {
          key: { lands_mined_on: 1 },
          background: true,
        },
        {
          key: { planets_mined_on: 1 },
          background: true,
        },
        {
          key: { mine_rating: 1 },
          background: true,
        },
        {
          key: {
            wallet_id: 1,
            start_timestamp: 1,
            end_timestamp: 1,
          },
          unique: true,
          background: true,
        },
      ],
    });
  }

  public async updateManyByWalletId(documents: LeaderboardDocument[]) {
    try {
      const operations = documents.map(dto => {
        const { _id, ...documentWithoutId } = dto;
        const { wallet_id, start_timestamp, end_timestamp } = documentWithoutId;
        return {
          updateOne: {
            filter: {
              $and: [
                { wallet_id },
                { start_timestamp: { $gte: start_timestamp } },
                { end_timestamp: { $lte: end_timestamp } },
              ],
            },
            update: {
              $set: documentWithoutId as MongoDB.MatchKeysAndValues<LeaderboardDocument>,
            },
            upsert: true,
          },
        };
      });
      const { modifiedCount, upsertedCount, upsertedIds } =
        await this.collection.bulkWrite(operations);
      return { modifiedCount, upsertedCount, upsertedIds };
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }

  public async completeUpdate() {
    try {
      const { modifiedCount } = await this.collection.updateMany(
        { last_update_completed: false },
        { $set: { last_update_completed: true } }
      );
      return { modifiedCount };
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }

  public async revertUpdate() {
    try {
      const { deletedCount } = await this.collection.deleteMany({
        last_update_completed: false,
      });

      return { deletedCount };
    } catch (error) {
      throw DataSourceOperationError.fromError(error);
    }
  }

  public async findUser(
    user: string,
    sort: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<LeaderboardDocument> {
    const { collectionName } = this;
    const match =
      fromDate && toDate
        ? {
            $and: [
              { $or: [{ wallet_id: user }, { username: user }] },
              { start_timestamp: { $gte: fromDate } },
              { end_timestamp: { $lte: toDate } },
            ],
          }
        : { $or: [{ wallet_id: user }, { username: user }] };

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: collectionName,
          let: { sortBy: '$' + sort },
          pipeline: [
            {
              $match: {
                $expr: { $gt: ['$' + sort, '$$sortBy'] },
              },
            },
            { $project: { wallet_id: 1 } },
          ],
          as: 'higherScores',
        },
      },
      {
        $addFields: {
          rank: { $add: [{ $size: '$higherScores' }, 1] },
        },
      },
      {
        $unset: 'higherScores',
      },
    ];

    const documents = await this.aggregate({ pipeline });


    return documents[0];
  }
}

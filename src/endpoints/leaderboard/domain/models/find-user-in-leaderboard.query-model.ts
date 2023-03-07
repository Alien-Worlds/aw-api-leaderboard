import { MongoAggregateParams, QueryModel } from '@alien-worlds/api-core';
import {
  MiningLeaderboardSort,
  MiningLeaderboardOrder,
} from '../mining-leaderboard.enums';
import { FindUserInLeaderboardInput } from './find-user-in-leaderboard.input';

export class FindUserInLeaderboardQueryModel extends QueryModel<MongoAggregateParams> {
  public static create(
    data?: FindUserInLeaderboardInput
  ): FindUserInLeaderboardQueryModel {
    const { fromDate, toDate, walletId } = data || {};

    return new FindUserInLeaderboardQueryModel(
      walletId,
      fromDate,
      toDate,
      MiningLeaderboardSort.TlmGainsTotal,
      MiningLeaderboardOrder.Desc,
      true
    );
  }

  protected constructor(
    private walletId: string,
    private fromDate: Date,
    private toDate: Date,
    private sort: MiningLeaderboardSort,
    private order: number,
    private calculatePosition: boolean
  ) {
    super();
  }

  public toQueryParams(): MongoAggregateParams {
    const { order, sort, fromDate, toDate, walletId, calculatePosition } = this;

    const pipeline = calculatePosition
      ? [
          {
            $match: {
              $and: [
                {
                  start_timestamp: { $gte: fromDate },
                },
                {
                  end_timestamp: { $lte: toDate },
                },
              ],
            },
          },
          { $sort: JSON.parse(`{ ${sort}:${order} }`) },
          {
            $group: {
              _id: null,
              wallet_ids: { $push: '$wallet_id' },
              data: { $push: '$$ROOT' },
            },
          },
          { $unwind: { path: '$data', includeArrayIndex: 'position' } },
          { $match: { 'data.wallet_id': walletId } },
          {
            $project: {
              position: 1,
              _id: '$data._id',
              start_timestamp: '$data.start_timestamp',
              end_timestamp: '$data.end_timestamp',
              last_update_timestamp: '$data.last_update_timestamp',
              wallet_id: '$data.wallet_id',
              username: '$data.username',
              tlm_gains_total: '$data.tlm_gains_total',
              tlm_gains_highest: '$data.tlm_gains_highest',
              total_nft_points: '$data.total_nft_points',
              tools_used: '$data.tools_used',
              total_charge_time: '$data.total_charge_time',
              avg_charge_time: '$data.avg_charge_time',
              total_mining_power: '$data.total_mining_power',
              avg_mining_power: '$data.avg_mining_power',
              total_nft_power: '$data.total_nft_power',
              avg_nft_power: '$data.avg_nft_power',
              lands: '$data.lands',
              lands_mined_on: '$data.lands_mined_on',
              planets: '$data.planets',
              planets_mined_on: '$data.planets_mined_on',
              mine_rating: '$data.mine_rating',
            },
          },
        ]
      : [
          {
            $match: {
              $and: [
                {
                  start_timestamp: { $gte: fromDate },
                },
                {
                  end_timestamp: { $lte: toDate },
                },
                {
                  wallet_id: walletId,
                },
              ],
            },
          },
        ];

    return {
      pipeline,
      options: { allowDiskUse: true },
    };
  }
}

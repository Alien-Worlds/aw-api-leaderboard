import { MongoDB, MongoFindQueryParams, QueryModel } from '@alien-worlds/api-core';
import { LeaderboardDocument } from '../../data/leaderboard.dtos';
import {
  MiningLeaderboardSort,
  MiningLeaderboardOrder,
} from '../mining-leaderboard.enums';
import { ListLeaderboardInput } from './list-leaderboard.input';

export class ListLeaderboardQueryModel extends QueryModel<
  MongoFindQueryParams<LeaderboardDocument>
> {
  public static create(data?: ListLeaderboardInput): ListLeaderboardQueryModel {
    const { sort, order, offset, limit, fromDate, toDate } = data || {};

    return new ListLeaderboardQueryModel(
      fromDate,
      toDate,
      sort || MiningLeaderboardSort.TlmGainsTotal,
      order || MiningLeaderboardOrder.Desc,
      offset || 0,
      limit || 10
    );
  }

  protected constructor(
    private fromDate: Date,
    private toDate: Date,
    private sort: string,
    private order: number,
    private skip: number,
    private limit: number
  ) {
    super();
  }

  public toQueryParams(): MongoFindQueryParams<LeaderboardDocument> {
    const { order, sort, limit, skip, fromDate, toDate } = this;
    const filter: MongoDB.Filter<LeaderboardDocument> = {
      $and: [
        {
          start_timestamp: { $gte: fromDate },
        },
        {
          end_timestamp: { $lt: toDate },
        },
      ],
    };

    const options: MongoDB.FindOptions = {
      skip,
      sort: JSON.parse(`{ ${sort}: ${order} }`),
      limit,
    };

    return { filter, options };
  }
}

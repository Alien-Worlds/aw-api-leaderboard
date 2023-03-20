import { MongoDB, MongoFindQueryParams, QueryModel } from '@alien-worlds/api-core';
import { LeaderboardDocument } from '../../data/leaderboard.dtos';
import { ListLeaderboardInput } from './list-leaderboard.input';

export class ListLeaderboardCountQueryModel extends QueryModel<
  MongoFindQueryParams<LeaderboardDocument>
> {
  public static create(data?: ListLeaderboardInput): ListLeaderboardCountQueryModel {
    const { fromDate, toDate } = data || {};

    return new ListLeaderboardCountQueryModel(fromDate, toDate);
  }

  protected constructor(private fromDate: Date, private toDate: Date) {
    super();
  }

  public toQueryParams(): MongoFindQueryParams<LeaderboardDocument> {
    const { fromDate, toDate } = this;
    const filter: MongoDB.Filter<LeaderboardDocument> = {
      $and: [
        {
          start_timestamp: { $gte: fromDate },
        },
        {
          end_timestamp: { $lte: toDate },
        },
      ],
    };

    const options: MongoDB.FindOptions = {};

    return { filter, options };
  }
}

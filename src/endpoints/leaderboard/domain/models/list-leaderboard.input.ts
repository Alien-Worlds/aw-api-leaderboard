import { LeaderboardOrder, LeaderboardSort, LeaderboardTimeframe } from '@alien-worlds/aw-api-common-leaderboard';
import { IO, Request } from '@alien-worlds/aw-core';

import { ListLeaderboardRequest, ListLeaderboardRequestQueryParams } from '../../data/leaderboard.dtos';
import { createTimeRange } from '../leaderboard.utils';

export class ListLeaderboardInput implements IO {
  public static create(
    request: Request<
      ListLeaderboardRequest,
      unknown,
      ListLeaderboardRequestQueryParams
    >
  ): ListLeaderboardInput {
    const { query } = request;

    const selectedTimeframe = query.timeframe || LeaderboardTimeframe.Daily;
    const { fromDate, toDate } = createTimeRange(query);

    return new ListLeaderboardInput(
      selectedTimeframe,
      query.sort || LeaderboardSort.TlmGainsTotal,
      Number(query.order) || LeaderboardOrder.Desc,
      query.offset || 0,
      query.limit || 10,
      fromDate,
      toDate
    );
  }

  private constructor(
    public readonly timeframe: string,
    public readonly sort: string,
    public readonly order: number,
    public readonly offset: number,
    public readonly limit: number,
    public readonly fromDate: Date,
    public readonly toDate: Date
  ) { }

  toJSON(): unknown {
    throw new Error('Method not implemented.');
  }
}

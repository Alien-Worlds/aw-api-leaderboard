import { IO, Request } from '@alien-worlds/aw-core';
import { LeaderboardSort, LeaderboardTimeframe } from '@alien-worlds/aw-api-common-leaderboard';

import { FindUserInLeaderboardRequest } from './../../data/leaderboard.dtos';
import { createTimeRange } from '../leaderboard.utils';

export class FindUserInLeaderboardInput implements IO {
  public static create(
    request: Request<
      FindUserInLeaderboardRequest,
      FindUserInLeaderboardRequest,
      FindUserInLeaderboardRequest
    >
  ): FindUserInLeaderboardInput {
    const { query } = request;
    const selectedTimeframe = query.timeframe || LeaderboardTimeframe.Daily;
    const { fromDate, toDate } = createTimeRange(query);

    return new FindUserInLeaderboardInput(
      query.user,
      selectedTimeframe,
      query.sort || LeaderboardSort.TlmGainsTotal,
      fromDate,
      toDate
    );
  }

  private constructor(
    public readonly user: string,
    public readonly timeframe: string,
    public readonly sort: string,
    public readonly fromDate: Date,
    public readonly toDate: Date
  ) { }
  toJSON(): unknown {
    throw new Error('Method not implemented.');
  }
}

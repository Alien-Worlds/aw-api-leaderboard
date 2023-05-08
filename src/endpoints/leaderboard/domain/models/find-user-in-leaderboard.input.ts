import {
  LeaderboardSort,
  LeaderboardTimeframe,
} from '@alien-worlds/alienworlds-api-common';
import { createTimeRange } from '../leaderboard.utils';

import { FindUserInLeaderboardRequest } from './../../data/leaderboard.dtos';
import { Request } from '@alien-worlds/api-core';

export class FindUserInLeaderboardInput {
  public static fromRequest(
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
  ) {}
}

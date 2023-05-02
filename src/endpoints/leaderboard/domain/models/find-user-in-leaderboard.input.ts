import { LeaderboardSort, LeaderboardTimeframe } from '@alien-worlds/alienworlds-api-common';
import { getEndDateByTimeframe, getStartDateByTimeframe } from '../leaderboard.utils';

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

    const now = new Date();
    const selectedTimeframe = query.timeframe || LeaderboardTimeframe.Daily;
    const fromDate = getStartDateByTimeframe(
      query.fromDate || query.date || now,
      selectedTimeframe
    );
    const toDate = getEndDateByTimeframe(
      query.toDate || query.date || now,
      selectedTimeframe
    );

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

import { getEndDateByTimeframe, getStartDateByTimeframe } from '../leaderboard.utils';

import { ListLeaderboardRequest } from '../../data/leaderboard.dtos';
import { Request } from '@alien-worlds/api-core';
import {
  LeaderboardOrder,
  LeaderboardSort,
  LeaderboardTimeframe,
} from '@alien-worlds/alienworlds-api-common';

export class ListLeaderboardInput {
  public static fromRequest(
    request: Request<
      ListLeaderboardRequest,
      ListLeaderboardRequest,
      ListLeaderboardRequest
    >
  ): ListLeaderboardInput {
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
  ) {}
}

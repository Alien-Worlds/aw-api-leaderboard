import { Request } from '@alien-worlds/api-core';

import { ListLeaderboardRequest } from '../../data/leaderboard.dtos';
import { MiningLeaderboardOrder, MiningLeaderboardSort, MiningLeaderboardTimeframe } from '../mining-leaderboard.enums';
import { getEndDateByTimeframe, getStartDateByTimeframe } from './query-model.utils';

export class ListLeaderboardInput {
  public static fromRequest(
    request: Request<
      ListLeaderboardRequest,
      ListLeaderboardRequest,
      ListLeaderboardRequest
    >
  ): ListLeaderboardInput {
    const { query } = request;
    const { timeframe } = request.params as ListLeaderboardRequest;
    const now = new Date();
    const selectedTimeframe = timeframe || MiningLeaderboardTimeframe.Daily;
    const fromDate = getStartDateByTimeframe(
      query.fromDate || query.date || now,
      selectedTimeframe
    );
    const toDate = getEndDateByTimeframe(
      query.toDate || query.date || now,
      selectedTimeframe
    );

    return new ListLeaderboardInput(
      timeframe || MiningLeaderboardTimeframe.Daily,
      query.sort || MiningLeaderboardSort.TlmGainsTotal,
      query.order || MiningLeaderboardOrder.Desc,
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
}

import { Request } from '@alien-worlds/api-core';
import { ListLeaderboardRequest } from '../../data/leaderboard.dtos';
import {
  MiningLeaderboardOrder,
  MiningLeaderboardSort,
  MiningLeaderboardTimeframe,
} from '../mining-leaderboard.enums';
import { getEndDateByTimeframe, getStartDateByTimeframe } from './query-model.utils';

export class ListLeaderboardInput {
  public static fromRequest(
    request: Request<ListLeaderboardRequest>
  ): ListLeaderboardInput {
    const {
      query: { timeframe, sort, offset, limit },
      body,
    } = request;

    const now = new Date();
    const selectedTimeframe = timeframe || MiningLeaderboardTimeframe.Daily;
    const fromDate = getStartDateByTimeframe(
      body.fromDate || body.date || now,
      selectedTimeframe
    );
    const toDate = getEndDateByTimeframe(
      body.toDate || body.date || now,
      selectedTimeframe
    );

    return new ListLeaderboardInput(
      timeframe || MiningLeaderboardTimeframe.Daily,
      sort || MiningLeaderboardSort.TlmGainsTotal,
      MiningLeaderboardOrder.Desc,
      offset || 0,
      limit || 10,
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

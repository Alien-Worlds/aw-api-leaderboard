import { FindUserInLeaderboardRequest } from './../../data/leaderboard.dtos';
import { Request } from '@alien-worlds/api-core';
import {
  MiningLeaderboardSort,
  MiningLeaderboardTimeframe,
} from '../mining-leaderboard.enums';
import { getEndDateByTimeframe, getStartDateByTimeframe } from './query-model.utils';

export class FindUserInLeaderboardInput {
  public static fromRequest(
    request: Request<
      FindUserInLeaderboardRequest,
      FindUserInLeaderboardRequest,
      FindUserInLeaderboardRequest
    >
  ): FindUserInLeaderboardInput {
    const { query } = request;
    const { timeframe } = request.params as FindUserInLeaderboardRequest;

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

    return new FindUserInLeaderboardInput(
      query.user,
      timeframe || MiningLeaderboardTimeframe.Daily,
      query.sort || MiningLeaderboardSort.TlmGainsTotal,
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

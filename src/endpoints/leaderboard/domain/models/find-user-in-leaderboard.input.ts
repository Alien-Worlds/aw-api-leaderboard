import { FindUserInLeaderboardRequest } from './../../data/leaderboard.dtos';
import { Request } from '@alien-worlds/api-core';
import { MiningLeaderboardTimeframe } from '../mining-leaderboard.enums';
import { getEndDateByTimeframe, getStartDateByTimeframe } from './query-model.utils';

export class FindUserInLeaderboardInput {
  public static fromRequest(
    request: Request<FindUserInLeaderboardRequest>
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
      query.walletId,
      query.username,
      timeframe || MiningLeaderboardTimeframe.Daily,
      fromDate,
      toDate
    );
  }

  private constructor(
    public readonly walletId: string,
    public readonly username: string,
    public readonly timeframe: string,
    public readonly fromDate: Date,
    public readonly toDate: Date
  ) {}
}

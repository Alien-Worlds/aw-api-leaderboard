import { FindUserInLeaderboardRequest } from './../../data/leaderboard.dtos';
import { Request } from '@alien-worlds/api-core';
import { MiningLeaderboardTimeframe } from '../mining-leaderboard.enums';
import { getEndDateByTimeframe, getStartDateByTimeframe } from './query-model.utils';

export class FindUserInLeaderboardInput {
  public static fromRequest(
    request: Request<FindUserInLeaderboardRequest>
  ): FindUserInLeaderboardInput {
    const {
      query: { timeframe },
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

    return new FindUserInLeaderboardInput(
      body.walletId,
      body.username,
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

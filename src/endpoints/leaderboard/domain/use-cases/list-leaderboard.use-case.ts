import { Failure, inject, injectable, Result, UseCase } from '@alien-worlds/api-core';
import { ListLeaderboardInput } from '../models/list-leaderboard.input';
import {
  DailyLeaderboardRepository,
  Leaderboard,
  LeaderboardTimeframe,
  MonthlyLeaderboardRepository,
  WeeklyLeaderboardRepository,
} from '@alien-worlds/alienworlds-api-common';

/*imports*/
/**
 * @class
 */
@injectable()
export class ListLeaderboardUseCase implements UseCase<Leaderboard[]> {
  public static Token = 'LIST_LEADERBOARD_USE_CASE';

  constructor(
    @inject(DailyLeaderboardRepository.Token)
    private dailyLeaderboardRepository: DailyLeaderboardRepository,
    @inject(WeeklyLeaderboardRepository.Token)
    private weeklyLeaderboardRepository: WeeklyLeaderboardRepository,
    @inject(MonthlyLeaderboardRepository.Token)
    private monthlyLeaderboardRepository: MonthlyLeaderboardRepository
  ) {}

  /**
   * @async
   * @returns {Promise<Result<Leaderboard[]>>}
   */
  public async execute(input: ListLeaderboardInput): Promise<Result<Leaderboard[]>> {
    //
    const { timeframe, sort, fromDate, toDate, offset, limit, order } = input;

    if (timeframe === LeaderboardTimeframe.Daily) {
      return this.dailyLeaderboardRepository.list(
        sort,
        offset,
        limit,
        order,
        fromDate,
        toDate
      );
    }

    if (timeframe === LeaderboardTimeframe.Weekly) {
      return this.weeklyLeaderboardRepository.list(
        sort,
        offset,
        limit,
        order,
        fromDate,
        toDate
      );
    }

    if (timeframe === LeaderboardTimeframe.Monthly) {
      return this.monthlyLeaderboardRepository.list(
        sort,
        offset,
        limit,
        order,
        fromDate,
        toDate
      );
    }

    return Result.withFailure(Failure.withMessage(`Unhandled timeframe ${timeframe}`));
  }

  /*methods*/
}

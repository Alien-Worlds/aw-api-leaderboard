import { Failure, inject, injectable, Result, UseCase } from '@alien-worlds/api-core';
import { ListLeaderboardInput } from '../models/list-leaderboard.input';
import {
  DailyLeaderboardRepository,
  LeaderboardTimeframe,
  MonthlyLeaderboardRepository,
  WeeklyLeaderboardRepository,
} from '@alien-worlds/leaderboard-api-common';

/*imports*/
/**
 * @class
 */
@injectable()
export class CountLeaderboardUseCase implements UseCase<number> {
  public static Token = 'COUNT_LEADERBOARD_USE_CASE';

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
   * @returns {Promise<Result<number>>}
   */
  public async execute(input: ListLeaderboardInput): Promise<Result<number>> {
    const { timeframe, fromDate, toDate } = input;

    if (timeframe === LeaderboardTimeframe.Daily) {
      return this.dailyLeaderboardRepository.count(fromDate, toDate);
    }

    if (timeframe === LeaderboardTimeframe.Weekly) {
      return this.weeklyLeaderboardRepository.count(fromDate, toDate);
    }

    if (timeframe === LeaderboardTimeframe.Monthly) {
      return this.monthlyLeaderboardRepository.count(fromDate, toDate);
    }

    return Result.withFailure(Failure.withMessage(`Unhandled timeframe ${timeframe}`));
  }

  /*methods*/
}

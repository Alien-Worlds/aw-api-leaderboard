import { Failure, inject, injectable, Result, UseCase } from '@alien-worlds/api-core';
import { Leaderboard } from '../entities/leaderboard';
import { MiningLeaderboardTimeframe } from '../mining-leaderboard.enums';
import { ListLeaderboardInput } from '../models/list-leaderboard.input';
import { MiningDailyLeaderboardRepository } from '../repositories/mining-daily-leaderboard.repository';
import { MiningMonthlyLeaderboardRepository } from '../repositories/mining-monthly-leaderboard.repository';
import { MiningWeeklyLeaderboardRepository } from '../repositories/mining-weekly-leaderboard.repository';

/*imports*/
/**
 * @class
 */
@injectable()
export class ListLeaderboardUseCase implements UseCase<Leaderboard[]> {
  public static Token = 'LIST_LEADERBOARD_USE_CASE';

  constructor(
    @inject(MiningDailyLeaderboardRepository.Token)
    private dailyLeaderboardRepository: MiningDailyLeaderboardRepository,
    @inject(MiningWeeklyLeaderboardRepository.Token)
    private weeklyLeaderboardRepository: MiningWeeklyLeaderboardRepository,
    @inject(MiningMonthlyLeaderboardRepository.Token)
    private monthlyLeaderboardRepository: MiningMonthlyLeaderboardRepository
  ) {}

  /**
   * @async
   * @returns {Promise<Result<Leaderboard[]>>}
   */
  public async execute(input: ListLeaderboardInput): Promise<Result<Leaderboard[]>> {
    //
    const { timeframe, sort, fromDate, toDate, offset, limit } = input;

    if (timeframe === MiningLeaderboardTimeframe.Daily) {
      return this.dailyLeaderboardRepository.list(sort, offset, limit, fromDate, toDate);
    }

    if (timeframe === MiningLeaderboardTimeframe.Weekly) {
      return this.weeklyLeaderboardRepository.list(sort, offset, limit, fromDate, toDate);
    }

    if (timeframe === MiningLeaderboardTimeframe.Monthly) {
      return this.monthlyLeaderboardRepository.list(
        sort,
        offset,
        limit,
        fromDate,
        toDate
      );
    }

    return Result.withFailure(Failure.withMessage(`Unhandled timeframe ${timeframe}`));
  }

  /*methods*/
}

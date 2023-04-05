import { Failure, inject, injectable, Result, UseCase } from '@alien-worlds/api-core';
import { MiningLeaderboardTimeframe } from '../mining-leaderboard.enums';
import { MiningDailyLeaderboardRepository } from '../repositories/mining-daily-leaderboard.repository';
import { MiningMonthlyLeaderboardRepository } from '../repositories/mining-monthly-leaderboard.repository';
import { MiningWeeklyLeaderboardRepository } from '../repositories/mining-weekly-leaderboard.repository';

/*imports*/
/**
 * @class
 */
@injectable()
export class ArchiveLeaderboardUseCase implements UseCase<boolean> {
  public static Token = 'ARCHIVE_LEADERBOARD_USE_CASE';

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
   * @returns {Promise<Result<number>>}
   */
  public async execute(timeframe: string): Promise<Result<boolean>> {

    if (timeframe === MiningLeaderboardTimeframe.Daily) {
      return this.dailyLeaderboardRepository.archive();
    }

    if (timeframe === MiningLeaderboardTimeframe.Weekly) {
      return this.weeklyLeaderboardRepository.archive();
    }

    if (timeframe === MiningLeaderboardTimeframe.Monthly) {
      return this.monthlyLeaderboardRepository.archive();
    }

    return Result.withFailure(Failure.withMessage(`Unhandled timeframe ${timeframe}`));
  }

  /*methods*/
}

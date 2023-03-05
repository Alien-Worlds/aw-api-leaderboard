import { inject, injectable, Result, UseCase } from '@alien-worlds/api-core';
import { Leaderboard } from '../entities/leaderboard';
import { MiningLeaderboardTimeframe } from '../mining-leaderboard.enums';
import { FindUserInLeaderboardInput } from '../models/find-user-in-leaderboard.input';
import { MiningDailyLeaderboardRepository } from '../repositories/mining-daily-leaderboard.repository';
import { MiningMonthlyLeaderboardRepository } from '../repositories/mining-monthly-leaderboard.repository';
import { MiningWeeklyLeaderboardRepository } from '../repositories/mining-weekly-leaderboard.repository';

/*imports*/
/**
 * @class
 */
@injectable()
export class FindUserInLeaderboardUseCase implements UseCase<Leaderboard> {
  public static Token = 'FIND_USER_IN_LEADERBOARD_USE_CASE';

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
   * @returns {Promise<Result<Leaderboard>>}
   */
  public async execute(input: FindUserInLeaderboardInput): Promise<Result<Leaderboard>> {
    if (input.timeframe === MiningLeaderboardTimeframe.Daily) {
      return Result.withContent(null);
    }

    if (input.timeframe === MiningLeaderboardTimeframe.Weekly) {
      return Result.withContent(null);
    }

    if (input.timeframe === MiningLeaderboardTimeframe.Monthly) {
      return Result.withContent(null);
    }
  }

  /*methods*/
}

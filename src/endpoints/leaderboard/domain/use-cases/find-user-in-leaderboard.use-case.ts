import { Failure, inject, injectable, Result, UseCase } from '@alien-worlds/api-core';
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
    const { username, walletId, fromDate, toDate, timeframe } = input;

    if (timeframe === MiningLeaderboardTimeframe.Daily) {
      return this.dailyLeaderboardRepository.findUser(
        username,
        walletId,
        fromDate,
        toDate
      );
    }

    if (timeframe === MiningLeaderboardTimeframe.Weekly) {
      return this.weeklyLeaderboardRepository.findUser(
        username,
        walletId,
        fromDate,
        toDate
      );
    }

    if (timeframe === MiningLeaderboardTimeframe.Monthly) {
      return this.monthlyLeaderboardRepository.findUser(
        username,
        walletId,
        fromDate,
        toDate
      );
    }

    return Result.withFailure(Failure.withMessage(`Unhandled timeframe ${timeframe}`));
  }

  /*methods*/
}

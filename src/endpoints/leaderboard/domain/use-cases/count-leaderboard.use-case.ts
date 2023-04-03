import { Failure, inject, injectable, Result, UseCase } from '@alien-worlds/api-core';
import { MiningLeaderboardTimeframe } from '../mining-leaderboard.enums';
import { ListLeaderboardCountQueryModel } from '../models/list-leaderboard-count.query-model';
import { ListLeaderboardInput } from '../models/list-leaderboard.input';
import { MiningDailyLeaderboardRepository } from '../repositories/mining-daily-leaderboard.repository';
import { MiningMonthlyLeaderboardRepository } from '../repositories/mining-monthly-leaderboard.repository';
import { MiningWeeklyLeaderboardRepository } from '../repositories/mining-weekly-leaderboard.repository';

/*imports*/
/**
 * @class
 */
@injectable()
export class CountLeaderboardUseCase implements UseCase<number> {
  public static Token = 'COUNT_LEADERBOARD_USE_CASE';

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
  public async execute(input: ListLeaderboardInput): Promise<Result<number>> {
    const { timeframe } = input;
    const countQueryModel = ListLeaderboardCountQueryModel.create(input);

    if (timeframe === MiningLeaderboardTimeframe.Daily) {
      return this.dailyLeaderboardRepository.count(countQueryModel);
    }

    if (timeframe === MiningLeaderboardTimeframe.Weekly) {
      return this.weeklyLeaderboardRepository.count(countQueryModel);
    }

    if (timeframe === MiningLeaderboardTimeframe.Monthly) {
      return this.monthlyLeaderboardRepository.count(countQueryModel);
    }

    return Result.withFailure(Failure.withMessage(`Unhandled timeframe ${timeframe}`));
  }

  /*methods*/
}

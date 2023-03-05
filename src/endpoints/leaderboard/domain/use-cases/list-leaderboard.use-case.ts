import { inject, injectable, Result, UseCase } from '@alien-worlds/api-core';
import { Leaderboard } from '../entities/leaderboard';
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
    return Result.withContent(null);
  }

  /*methods*/
}

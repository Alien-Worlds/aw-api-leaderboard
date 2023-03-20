import { Failure, inject, injectable, Result, UseCase } from '@alien-worlds/api-core';
import { MiningLeaderboardTimeframe } from '../mining-leaderboard.enums';
import { ListLeaderboardInput } from '../models/list-leaderboard.input';
import { MiningDailyLeaderboardRepository } from '../repositories/mining-daily-leaderboard.repository';
import { MiningMonthlyLeaderboardRepository } from '../repositories/mining-monthly-leaderboard.repository';
import { MiningWeeklyLeaderboardRepository } from '../repositories/mining-weekly-leaderboard.repository';
import { ListLeaderboardControllerOutput } from '../../data/leaderboard.dtos';
import { ListLeaderboardCountQueryModel } from '../models/list-leaderboard-count.query-model';

/*imports*/
/**
 * @class
 */
@injectable()
export class ListLeaderboardUseCase implements UseCase<ListLeaderboardControllerOutput> {
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
  public async execute(
    input: ListLeaderboardInput
  ): Promise<Result<ListLeaderboardControllerOutput>> {
    const { timeframe, sort, fromDate, toDate, offset, limit, order } = input;

    const countQueryModel = ListLeaderboardCountQueryModel.create(input);

    if (timeframe === MiningLeaderboardTimeframe.Daily) {
      const { content: listDaily, failure: dailyLeaderboardListFailure } =
        await this.dailyLeaderboardRepository.list(
          sort,
          offset,
          limit,
          order,
          fromDate,
          toDate
        );

      if (dailyLeaderboardListFailure) {
        return Result.withFailure(dailyLeaderboardListFailure);
      }

      const { content: countDaily, failure: dailyLeaderboardCountFailure } =
        await this.dailyLeaderboardRepository.count(countQueryModel);

      if (dailyLeaderboardCountFailure) {
        return Result.withFailure(dailyLeaderboardCountFailure);
      }

      return Result.withContent({
        results: listDaily,
        total: countDaily,
      });
    }

    if (timeframe === MiningLeaderboardTimeframe.Weekly) {
      const { content: listWeekly, failure: weeklyLeaderboardListFailure } =
        await this.weeklyLeaderboardRepository.list(
          sort,
          offset,
          limit,
          order,
          fromDate,
          toDate
        );

      if (weeklyLeaderboardListFailure) {
        return Result.withFailure(weeklyLeaderboardListFailure);
      }

      const { content: countDaily, failure: weeklyLeaderboardCountFailure } =
        await this.weeklyLeaderboardRepository.count(countQueryModel);

      if (weeklyLeaderboardCountFailure) {
        return Result.withFailure(weeklyLeaderboardCountFailure);
      }

      return Result.withContent({
        results: listWeekly,
        total: countDaily,
      });
    }

    if (timeframe === MiningLeaderboardTimeframe.Monthly) {
      const { content: listMonthly, failure: monthlyLeaderboardListFailure } =
        await this.monthlyLeaderboardRepository.list(
          sort,
          offset,
          limit,
          order,
          fromDate,
          toDate
        );

      if (monthlyLeaderboardListFailure) {
        return Result.withFailure(monthlyLeaderboardListFailure);
      }

      const { content: countDaily, failure: monthlyLeaderboardCountFailure } =
        await this.monthlyLeaderboardRepository.count(countQueryModel);

      if (monthlyLeaderboardCountFailure) {
        return Result.withFailure(monthlyLeaderboardCountFailure);
      }

      return Result.withContent({
        results: listMonthly,
        total: countDaily,
      });
    }

    return Result.withFailure(Failure.withMessage(`Unhandled timeframe ${timeframe}`));
  }

  /*methods*/
}

import {
  inject,
  injectable,
  Result,
  UpdateStatus,
  UseCase,
} from '@alien-worlds/api-core';
import { Leaderboard } from '../entities/leaderboard';
import { UpdateLeaderboardInput } from '../models/update-leaderboard.input';
import { MiningDailyLeaderboardRepository } from '../repositories/mining-daily-leaderboard.repository';
import { MiningMonthlyLeaderboardRepository } from '../repositories/mining-monthly-leaderboard.repository';
import { MiningWeeklyLeaderboardRepository } from '../repositories/mining-weekly-leaderboard.repository';

/*imports*/
/**
 * @class
 */
@injectable()
export class UpdateLeaderboardUseCase implements UseCase<void> {
  public static Token = 'UPDATE_LEADERBOARD_USE_CASE';

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
   */
  public async execute(input: UpdateLeaderboardInput): Promise<Result<void>> {
    const {
      username,
      walletId,
      fromDayStart,
      toDayEnd,
      fromMonthStart,
      toMonthEnd,
      fromWeekStart,
      toWeekEnd,
      bounty,
      blockNumber,
      blockTimestamp,
      points,
      landId,
      planetName,
      tools,
    } = input;

    // DAILY LEADERBOARD UPDATE

    let dailyUpdate: Result<UpdateStatus.Success | UpdateStatus.Failure, Error>;
    const userDailySearch = await this.dailyLeaderboardRepository.findUser(
      username,
      walletId,
      fromDayStart,
      toDayEnd
    );

    if (userDailySearch.isFailure) {
      dailyUpdate = await this.dailyLeaderboardRepository.update(
        Leaderboard.create(
          fromDayStart,
          toDayEnd,
          walletId,
          username,
          bounty,
          blockNumber,
          blockTimestamp,
          points,
          landId,
          planetName,
          tools
        )
      );
    } else {
      const { content: dailyUserLeaderboard } = userDailySearch;
      dailyUpdate = await this.dailyLeaderboardRepository.update(
        Leaderboard.cloneAndUpdate(dailyUserLeaderboard, input)
      );
    }

    if (dailyUpdate.isFailure) {
      return Result.withFailure(dailyUpdate.failure);
    }

    // WEEKLY LEADERBOARD UPDATE

    let weeklyUpdate: Result<UpdateStatus.Success | UpdateStatus.Failure, Error>;
    const userWeeklySearch = await this.weeklyLeaderboardRepository.findUser(
      username,
      walletId,
      fromWeekStart,
      toWeekEnd
    );

    if (userWeeklySearch.isFailure) {
      weeklyUpdate = await this.weeklyLeaderboardRepository.update(
        Leaderboard.create(
          fromWeekStart,
          toWeekEnd,
          walletId,
          username,
          bounty,
          blockNumber,
          blockTimestamp,
          points,
          landId,
          planetName,
          tools
        )
      );
    } else {
      const { content: weeklyUserLeaderboard } = userWeeklySearch;
      weeklyUpdate = await this.weeklyLeaderboardRepository.update(
        Leaderboard.cloneAndUpdate(weeklyUserLeaderboard, input)
      );
    }
    // Should we reverse daily leaderboard update?
    if (weeklyUpdate.isFailure) {
      return Result.withFailure(weeklyUpdate.failure);
    }

    // MONTHLY LEADERBOARD UPDATE

    let monthlyUpdate: Result<UpdateStatus.Success | UpdateStatus.Failure, Error>;
    const userMonthlySearch = await this.monthlyLeaderboardRepository.findUser(
      username,
      walletId,
      fromMonthStart,
      toMonthEnd
    );

    if (userMonthlySearch.isFailure) {
      monthlyUpdate = await this.monthlyLeaderboardRepository.update(
        Leaderboard.create(
          fromMonthStart,
          toMonthEnd,
          walletId,
          username,
          bounty,
          blockNumber,
          blockTimestamp,
          points,
          landId,
          planetName,
          tools
        )
      );
    } else {
      const { content: monthlyUserLeaderboard } = userMonthlySearch;
      monthlyUpdate = await this.monthlyLeaderboardRepository.update(
        Leaderboard.cloneAndUpdate(monthlyUserLeaderboard, input)
      );
    }

    // Should we reverse daily leaderboard update?
    // Should we reverse weekly leaderboard update?
    if (monthlyUpdate.isFailure) {
      return Result.withFailure(monthlyUpdate.failure);
    }

    return Result.withoutContent();
  }

  /*methods*/
}

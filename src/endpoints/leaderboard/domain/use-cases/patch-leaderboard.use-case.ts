import {
  inject,
  injectable,
  removeUndefinedProperties,
  Result,
  UpdateStatus,
  UseCase,
} from '@alien-worlds/api-core';

import { LeaderboardDocument } from '../../data/leaderboard.dtos';
import { Leaderboard } from '../entities/leaderboard';
import { MiningDailyLeaderboardRepository } from '../repositories/mining-daily-leaderboard.repository';
import { MiningLeaderboardRepository } from '../repositories/mining-leaderboard.repository';
import { MiningMonthlyLeaderboardRepository } from '../repositories/mining-monthly-leaderboard.repository';
import { MiningWeeklyLeaderboardRepository } from '../repositories/mining-weekly-leaderboard.repository';

/*imports*/
/**
 * @class
 */
@injectable()
export class PatchLeaderboardUseCase implements UseCase<void> {
  public static Token = 'PATCH_LEADERBOARD_USE_CASE';

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
  public async execute(input: Partial<LeaderboardDocument>): Promise<Result<void>> {
    const dailyPatch = await this.patchLeaderboardRepository(
      this.dailyLeaderboardRepository,
      input
    );
    if (dailyPatch.isFailure) {
      return Result.withFailure(dailyPatch.failure);
    }

    const weeklyPatch = await this.patchLeaderboardRepository(
      this.weeklyLeaderboardRepository,
      input
    );
    if (weeklyPatch.isFailure) {
      return Result.withFailure(weeklyPatch.failure);
    }

    const monthlyPatch = await this.patchLeaderboardRepository(
      this.monthlyLeaderboardRepository,
      input
    );
    if (monthlyPatch.isFailure) {
      return Result.withFailure(monthlyPatch.failure);
    }

    return Result.withoutContent();
  }

  /*methods*/
  private async patchLeaderboardRepository(
    repository: MiningLeaderboardRepository,
    updates: Partial<LeaderboardDocument>
  ): Promise<Result<void>> {
    const { wallet_id: walletId, ...leaderboardWithoutWalletId } =
      removeUndefinedProperties<LeaderboardDocument>(updates);
    const propsToUpdate = Object.keys(leaderboardWithoutWalletId);

    let patchResult: Result<UpdateStatus.Success | UpdateStatus.Failure, Error>;
    const userSearch = await repository.findAll(walletId);
    if (userSearch.isFailure) {
      return Result.withFailure(userSearch.failure);
    } else {
      const { content: userLeaderboard } = userSearch;

      userLeaderboard.forEach(async leaderboardEntry => {
        const updatedEntry = {};

        propsToUpdate.forEach(prop => {
          if (leaderboardEntry[prop] != leaderboardWithoutWalletId[prop]) {
            updatedEntry[prop] = leaderboardWithoutWalletId[prop];
          }
        });

        patchResult = await repository.update(
          Leaderboard.fromDocument({
            ...leaderboardEntry.toDocument(),
            ...updatedEntry,
          })
        );

        if (patchResult.isFailure) {
          return Result.withFailure(patchResult.failure);
        }
      });
    }

    return Result.withoutContent();
  }
}

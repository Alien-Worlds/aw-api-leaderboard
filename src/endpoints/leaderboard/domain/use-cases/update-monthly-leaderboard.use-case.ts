import { AtomicAsset } from '@alien-worlds/alienworlds-api-common';
import { inject, injectable, Result, UpdateStatus, UseCase } from '@alien-worlds/api-core';
import { MinigToolData } from '../../data/leaderboard.dtos';
import { Leaderboard } from '../entities/leaderboard';
import { LeaderboardEntry } from '../models/update-leaderboard.input';
import { MiningMonthlyLeaderboardRepository } from '../repositories/mining-monthly-leaderboard.repository';

/*imports*/
/**
 * @class
 */
@injectable()
export class UpdateMonthlyLeaderboardUseCase
  implements UseCase<UpdateStatus.Success | UpdateStatus.Failure>
{
  public static Token = 'UPDATE_MONTHLY_LEADERBOARD_USE_CASE';

  constructor(
    @inject(MiningMonthlyLeaderboardRepository.Token)
    private monthlyLeaderboardRepository: MiningMonthlyLeaderboardRepository
  ) {}

  /**
   * @async
   */
  public async execute(
    items: LeaderboardEntry[],
    assets: AtomicAsset<MinigToolData>[]
  ): Promise<Result<UpdateStatus.Success | UpdateStatus.Failure>> {
    const updates = [];
    // We can't fetch the data of all users from the list at once
    // because the leaderboard timeframes of individual players may differ from each other
    // We have to fetch data one at a time
    for (const item of items) {
      const {
        username,
        walletId,
        fromDayStart,
        toDayEnd,
        bounty,
        blockNumber,
        blockTimestamp,
        points,
        landId,
        planetName,
      } = item;
      const userMonthlySearch = await this.monthlyLeaderboardRepository.findUser(
        walletId,
        fromDayStart,
        toDayEnd
      );

      if (userMonthlySearch.isFailure) {
        updates.push(
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
            assets
          )
        );
      } else {
        const { content: monthlyUserLeaderboard } = userMonthlySearch;
        updates.push(Leaderboard.cloneAndUpdate(monthlyUserLeaderboard, item, assets));
      }
    }

    // and as part of improvements we can send already updated data at once

    return this.monthlyLeaderboardRepository.updateMany(updates);
  }

  /*methods*/
}

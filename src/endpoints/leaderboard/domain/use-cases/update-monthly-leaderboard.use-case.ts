import { AtomicAsset } from '@alien-worlds/alienworlds-api-common';
import {
  inject,
  injectable,
  Result,
  UpdateStatus,
  UseCase,
} from '@alien-worlds/api-core';
import { MinigToolData } from '../../data/leaderboard.dtos';
import { Leaderboard } from '../entities/leaderboard';
import { LeaderboardUpdate } from '../models/update-leaderboard.input';
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
    updates: LeaderboardUpdate[],
    assetsByItem: Map<string, AtomicAsset<MinigToolData>[]>
  ): Promise<Result<UpdateStatus.Success | UpdateStatus.Failure>> {
    const newUpdates = [];
    // We can't fetch the data of all users from the list at once
    // because the leaderboard timeframes of individual players may differ from each other
    // We have to fetch data one at a time
    for (const update of updates) {
      const {
        username,
        walletId,
        fromMonthStart,
        toMonthEnd,
        bounty,
        blockNumber,
        blockTimestamp,
        points,
        landId,
        planetName,
      } = update;
      const userMonthlySearch = await this.monthlyLeaderboardRepository.findUser(
        walletId,
        fromMonthStart,
        toMonthEnd
      );
      const assets = assetsByItem.get(update.id);

      if (userMonthlySearch.isFailure) {
        newUpdates.push(
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
            assets
          )
        );
      } else {
        const { content: monthlyUserLeaderboard } = userMonthlySearch;

        if (monthlyUserLeaderboard.lastUpdateHash !== update.id) {
          newUpdates.push(
            Leaderboard.cloneAndUpdate(monthlyUserLeaderboard, update, assets)
          );
        }
      }
    }

    // and as part of improvements we can send already updated data at once

    return this.monthlyLeaderboardRepository.updateMany(newUpdates);
  }

  /*methods*/
}

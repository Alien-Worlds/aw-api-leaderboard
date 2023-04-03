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
import { MiningWeeklyLeaderboardRepository } from '../repositories/mining-weekly-leaderboard.repository';

/*imports*/
/**
 * @class
 */
@injectable()
export class UpdateWeeklyLeaderboardUseCase
  implements UseCase<UpdateStatus.Success | UpdateStatus.Failure>
{
  public static Token = 'UPDATE_WEEKLY_LEADERBOARD_USE_CASE';

  constructor(
    @inject(MiningWeeklyLeaderboardRepository.Token)
    private weeklyLeaderboardRepository: MiningWeeklyLeaderboardRepository
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
        fromWeekStart,
        toWeekEnd,
        bounty,
        blockNumber,
        blockTimestamp,
        points,
        landId,
        planetName,
      } = update;
      const userWeeklySearch = await this.weeklyLeaderboardRepository.findUser(
        walletId,
        fromWeekStart,
        toWeekEnd
      );
      const assets = assetsByItem.get(update.id);

      if (userWeeklySearch.isFailure) {
        newUpdates.push(
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
            assets
          )
        );
      } else {
        const { content: weeklyUserLeaderboard } = userWeeklySearch;
        if (weeklyUserLeaderboard.lastUpdateHash !== update.id) {
          newUpdates.push(
            Leaderboard.cloneAndUpdate(weeklyUserLeaderboard, update, assets)
          );
        }
      }
    }

    // and as part of improvements we can send already updated data at once

    return this.weeklyLeaderboardRepository.updateMany(newUpdates);
  }

  /*methods*/
}

import { AtomicAsset } from '@alien-worlds/alienworlds-api-common';
import { inject, injectable, Result, UseCase } from '@alien-worlds/api-core';
import { MinigToolData } from '../../data/leaderboard.dtos';
import { Leaderboard } from '../entities/leaderboard';
import { LeaderboardEntry } from '../models/update-leaderboard.input';
import { MiningDailyLeaderboardRepository } from '../repositories/mining-daily-leaderboard.repository';

/*imports*/
/**
 * @class
 */
@injectable()
export class UpdateDailyLeaderboardUseCase implements UseCase<void> {
  public static Token = 'UPDATE_DAILY_LEADERBOARD_USE_CASE';

  constructor(
    @inject(MiningDailyLeaderboardRepository.Token)
    private dailyLeaderboardRepository: MiningDailyLeaderboardRepository
  ) {}

  /**
   * @async
   */
  public async execute(
    items: LeaderboardEntry[],
    assets: AtomicAsset<MinigToolData>[]
  ): Promise<Result<void>> {
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
      const userDailySearch = await this.dailyLeaderboardRepository.findUser(
        username,
        walletId,
        fromDayStart,
        toDayEnd
      );

      if (userDailySearch.isFailure) {
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
        const { content: dailyUserLeaderboard } = userDailySearch;
        updates.push(Leaderboard.cloneAndUpdate(dailyUserLeaderboard, item, assets));
      }
    }

    // and as part of improvements we can send already updated data at once

    return this.dailyLeaderboardRepository.updateMany(updates);
  }

  /*methods*/
}
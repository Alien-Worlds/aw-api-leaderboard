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
import { MiningDailyLeaderboardRepository } from '../repositories/mining-daily-leaderboard.repository';

/*imports*/
/**
 * @class
 */
@injectable()
export class UpdateDailyLeaderboardUseCase
  implements UseCase<UpdateStatus.Success | UpdateStatus.Failure>
{
  public static Token = 'UPDATE_DAILY_LEADERBOARD_USE_CASE';

  constructor(
    @inject(MiningDailyLeaderboardRepository.Token)
    private dailyLeaderboardRepository: MiningDailyLeaderboardRepository
  ) {}

  /**
   * @async
   */
  public async execute(
    updates: LeaderboardUpdate[],
    assetsByItem: Map<string, AtomicAsset<MinigToolData>[]>
  ): Promise<Result<UpdateStatus.Success | UpdateStatus.Failure>> {
    const newUpdates: Leaderboard[] = [];

    // We can't fetch the data of all users from the list at once
    // because the leaderboard timeframes of individual players may differ from each other
    // We have to fetch data one at a time
    for (const update of updates) {
      const {
        username,
        walletId,
        fromDayStart,
        toDayEnd,
        bounty,
        points,
        landId,
        planetName,
      } = update;

      // skip history
      if (toDayEnd.getTime() < Date.now()) {
        continue;
      }

      const assets = assetsByItem.get(update.id);
      const { content: usersFound, failure: userSearchFailure } =
        await this.dailyLeaderboardRepository.findUsers([walletId]);

      if (userSearchFailure) {
        return Result.withFailure(userSearchFailure);
      }

      if (usersFound.length === 0) {
        newUpdates.push(
          Leaderboard.create(
            fromDayStart,
            toDayEnd,
            walletId,
            username,
            bounty,
            points,
            landId,
            planetName,
            assets
          )
        );
      } else {
        const current = usersFound[0];
        //
        if (current.lastUpdateHash !== update.id) {
          newUpdates.push(Leaderboard.cloneAndUpdate(current, update, assets));
        }
      }
    }

    return this.dailyLeaderboardRepository.update(newUpdates);
  }

  /*methods*/
}

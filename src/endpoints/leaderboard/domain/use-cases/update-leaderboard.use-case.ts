import { AtomicAsset, AtomicAssetRepository } from '@alien-worlds/alienworlds-api-common';
import {
  inject,
  injectable,
  Result,
  UpdateStatus,
  UseCase,
} from '@alien-worlds/api-core';
import { MinigToolData } from '../../data/leaderboard.dtos';
import { LeaderboardEntry } from '../models/update-leaderboard.input';
import { UpdateDailyLeaderboardUseCase } from './update-daily-leaderboard.use-case';
import { UpdateMonthlyLeaderboardUseCase } from './update-monthly-leaderboard.use-case';
import { UpdateWeeklyLeaderboardUseCase } from './update-weekly-leaderboard.use-case';

/*imports*/
/**
 * @class
 */
@injectable()
export class UpdateLeaderboardUseCase
  implements UseCase<UpdateStatus.Success | UpdateStatus.Failure>
{
  public static Token = 'UPDATE_LEADERBOARD_USE_CASE';

  constructor(
    @inject(UpdateDailyLeaderboardUseCase.Token)
    private updateDailyLeaderboardUseCase: UpdateDailyLeaderboardUseCase,
    @inject(UpdateWeeklyLeaderboardUseCase.Token)
    private updateWeeklyLeaderboardUseCase: UpdateWeeklyLeaderboardUseCase,
    @inject(UpdateMonthlyLeaderboardUseCase.Token)
    private updateMonthlyLeaderboardUseCase: UpdateMonthlyLeaderboardUseCase,
    @inject(AtomicAssetRepository.Token)
    private atomicAssetRepository: AtomicAssetRepository
  ) {}

  private async getAssets(items: LeaderboardEntry[]) {
    const ids = new Set<string | number | bigint>();
    const assets = [];

    items.forEach(item => {
      const { bagItems } = item;
      bagItems.forEach(id => {
        ids.add(id);
      });
    });

    if (ids.size > 0) {
      const { content, failure: atomicAssetsFailure } =
        await this.atomicAssetRepository.getAssets(Array.from(ids));

      if (atomicAssetsFailure) {
        //
      } else {
        assets.push(...content);
      }
    }

    return assets;
  }

  /**
   * @async
   */
  public async execute(
    items: LeaderboardEntry[]
  ): Promise<Result<UpdateStatus.Success | UpdateStatus.Failure>> {
    const assets = await this.getAssets(items);

    /*
     * UPDATE DAILY LEADERBOARD
     */
    const dailyUpdate = await this.updateDailyLeaderboardUseCase.execute(items, assets);

    if (dailyUpdate.isFailure) {
      return Result.withFailure(dailyUpdate.failure);
    }

    /*
     * UPDATE WEEKLY LEADERBOARD
     */

    const weeklyUpdate = await this.updateWeeklyLeaderboardUseCase.execute(
      items,
      <AtomicAsset<MinigToolData>[]>assets
    );

    // TODO: Should we reverse daily leaderboard update?
    if (weeklyUpdate.isFailure) {
      return Result.withFailure(weeklyUpdate.failure);
    }

    /*
     * UPDATE MONTHLY LEADERBOARD
     */

    const monthlyUpdate = await this.updateMonthlyLeaderboardUseCase.execute(
      items,
      <AtomicAsset<MinigToolData>[]>assets
    );

    // TODO: Should we reverse daily leaderboard update?
    // TODO: Should we reverse weekly leaderboard update?
    if (monthlyUpdate.isFailure) {
      return Result.withFailure(monthlyUpdate.failure);
    }

    return Result.withContent(UpdateStatus.Success);
  }

  /*methods*/
}

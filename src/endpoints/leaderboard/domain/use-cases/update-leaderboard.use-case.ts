import { GetAtomicAssetsUseCase } from './get-atomic-assets.use-case';
import { AtomicAsset } from '@alien-worlds/alienworlds-api-common';
import {
  inject,
  injectable,
  Result,
  UpdateStatus,
  UseCase,
} from '@alien-worlds/api-core';
import { MinigToolData } from '../../data/leaderboard.dtos';
import { LeaderboardUpdate } from '../models/update-leaderboard.input';
import { UpdateDailyLeaderboardUseCase } from './update-daily-leaderboard.use-case';
import { UpdateMonthlyLeaderboardUseCase } from './update-monthly-leaderboard.use-case';
import { UpdateWeeklyLeaderboardUseCase } from './update-weekly-leaderboard.use-case';
import { LeaderboardUpdateBackupRepository } from '../repositories/leaderboard-update-backup.repository';

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
    @inject(GetAtomicAssetsUseCase.Token)
    private getAtomicAssetsUseCase: GetAtomicAssetsUseCase,
    @inject(LeaderboardUpdateBackupRepository.Token)
    private leaderboardUpdateBackup: LeaderboardUpdateBackupRepository,
  ) {}

  /**
   * @async
   */
  public async execute(
    items: LeaderboardUpdate[]
  ): Promise<Result<UpdateStatus.Success | UpdateStatus.Failure>> {
    const { content, failure: assetsFailure } = await this.getAtomicAssetsUseCase.execute(
      items
    );
    const assets = content as Map<string, AtomicAsset<MinigToolData>[]>;

    if (assetsFailure) {
      //
      this.leaderboardUpdateBackup.addMany(items);
      return Result.withFailure(assetsFailure);
    }

    /*
     * UPDATE DAILY LEADERBOARD
     */
    const dailyUpdate = await this.updateDailyLeaderboardUseCase.execute(items, assets);

    if (dailyUpdate.isFailure) {
      this.leaderboardUpdateBackup.addMany(items);
      return Result.withFailure(dailyUpdate.failure);
    }

    /*
     * UPDATE WEEKLY LEADERBOARD
     */

    const weeklyUpdate = await this.updateWeeklyLeaderboardUseCase.execute(items, assets);

    if (weeklyUpdate.isFailure) {
      //
      this.leaderboardUpdateBackup.addMany(items);
      return Result.withFailure(weeklyUpdate.failure);
    }

    /*
     * UPDATE MONTHLY LEADERBOARD
     */

    const monthlyUpdate = await this.updateMonthlyLeaderboardUseCase.execute(
      items,
      assets
    );

    if (monthlyUpdate.isFailure) {
      //
      this.leaderboardUpdateBackup.addMany(items);
      return Result.withFailure(monthlyUpdate.failure);
    }

    return Result.withContent(UpdateStatus.Success);
  }

  /*methods*/
}

import { AtomicAsset, AtomicAssetRepository } from '@alien-worlds/alienworlds-api-common';
import { inject, injectable, Result, UseCase } from '@alien-worlds/api-core';
import { MinigToolData } from '../../data/leaderboard.dtos';
import { UpdateLeaderboardInput } from '../models/update-leaderboard.input';
import { UpdateDailyLeaderboardUseCase } from './update-daily-leaderboard.use-case';
import { UpdateMonthlyLeaderboardUseCase } from './update-monthly-leaderboard.use-case';
import { UpdateWeeklyLeaderboardUseCase } from './update-weekly-leaderboard.use-case';

/*imports*/
/**
 * @class
 */
@injectable()
export class UpdateLeaderboardUseCase implements UseCase<void> {
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

  /**
   * @async
   */
  public async execute(input: UpdateLeaderboardInput): Promise<Result<void>> {
    const { tools } = input;
    const assets = [];
    if (tools) {
      const { content, failure: atomicAssetsFailure } =
        await this.atomicAssetRepository.getAssets(tools);

      if (atomicAssetsFailure) {
        //
      } else {
        assets.push(...content);
      }
    }

    const dailyUpdate = await this.updateDailyLeaderboardUseCase.execute(
      input,
      <AtomicAsset<MinigToolData>[]>assets
    );

    if (dailyUpdate.isFailure) {
      return Result.withFailure(dailyUpdate.failure);
    }

    const weeklyUpdate = await this.updateWeeklyLeaderboardUseCase.execute(
      input,
      <AtomicAsset<MinigToolData>[]>assets
    );

    // TODO: Should we reverse daily leaderboard update?
    if (weeklyUpdate.isFailure) {
      return Result.withFailure(weeklyUpdate.failure);
    }

    const monthlyUpdate = await this.updateMonthlyLeaderboardUseCase.execute(
      input,
      <AtomicAsset<MinigToolData>[]>assets
    );

    // TODO: Should we reverse daily leaderboard update?
    // TODO: Should we reverse weekly leaderboard update?
    if (monthlyUpdate.isFailure) {
      return Result.withFailure(monthlyUpdate.failure);
    }

    return Result.withoutContent();
  }

  /*methods*/
}

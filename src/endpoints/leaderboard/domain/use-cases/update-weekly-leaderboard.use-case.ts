import { AtomicAsset } from '@alien-worlds/alienworlds-api-common';
import { inject, injectable, Result, UseCase } from '@alien-worlds/api-core';
import { MinigToolData } from '../../data/leaderboard.dtos';
import { Leaderboard } from '../entities/leaderboard';
import { UpdateLeaderboardInput } from '../models/update-leaderboard.input';
import { MiningWeeklyLeaderboardRepository } from '../repositories/mining-weekly-leaderboard.repository';

/*imports*/
/**
 * @class
 */
@injectable()
export class UpdateWeeklyLeaderboardUseCase implements UseCase<void> {
  public static Token = 'UPDATE_WEEKLY_LEADERBOARD_USE_CASE';

  constructor(
    @inject(MiningWeeklyLeaderboardRepository.Token)
    private weeklyLeaderboardRepository: MiningWeeklyLeaderboardRepository
  ) {}

  /**
   * @async
   */
  public async execute(
    input: UpdateLeaderboardInput,
    assets: AtomicAsset<MinigToolData>[]
  ): Promise<Result<void>> {
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
    } = input;

    let weeklyUpdate: Result;
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
          assets
        )
      );
    } else {
      const { content: weeklyUserLeaderboard } = userWeeklySearch;
      weeklyUpdate = await this.weeklyLeaderboardRepository.update(
        Leaderboard.cloneAndUpdate(weeklyUserLeaderboard, input, assets)
      );
    }
    return weeklyUpdate;
  }

  /*methods*/
}

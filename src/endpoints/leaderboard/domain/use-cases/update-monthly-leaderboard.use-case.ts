import { AtomicAsset } from '@alien-worlds/alienworlds-api-common';
import { inject, injectable, Result, UseCase } from '@alien-worlds/api-core';
import { MinigToolData } from '../../data/leaderboard.dtos';
import { Leaderboard } from '../entities/leaderboard';
import { UpdateLeaderboardInput } from '../models/update-leaderboard.input';
import { MiningMonthlyLeaderboardRepository } from '../repositories/mining-monthly-leaderboard.repository';

/*imports*/
/**
 * @class
 */
@injectable()
export class UpdateMonthlyLeaderboardUseCase implements UseCase<void> {
  public static Token = 'UPDATE_MONTHLY_LEADERBOARD_USE_CASE';

  constructor(
    @inject(MiningMonthlyLeaderboardRepository.Token)
    private monthlyLeaderboardRepository: MiningMonthlyLeaderboardRepository
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
      fromMonthStart,
      toMonthEnd,
      bounty,
      blockNumber,
      blockTimestamp,
      points,
      landId,
      planetName,
    } = input;

    let monthlyUpdate: Result;
    const userMonthlySearch = await this.monthlyLeaderboardRepository.findUser(
      username,
      walletId,
      fromMonthStart,
      toMonthEnd
    );

    if (userMonthlySearch.isFailure) {
      monthlyUpdate = await this.monthlyLeaderboardRepository.update(
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
      monthlyUpdate = await this.monthlyLeaderboardRepository.update(
        Leaderboard.cloneAndUpdate(monthlyUserLeaderboard, input, assets)
      );
    }
    return monthlyUpdate;
  }

  /*methods*/
}

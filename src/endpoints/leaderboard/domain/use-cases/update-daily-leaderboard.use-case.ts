import { AtomicAsset } from '@alien-worlds/alienworlds-api-common';
import { inject, injectable, Result, UseCase } from '@alien-worlds/api-core';
import { MinigToolData } from '../../data/leaderboard.dtos';
import { Leaderboard } from '../entities/leaderboard';
import { UpdateLeaderboardInput } from '../models/update-leaderboard.input';
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
    input: UpdateLeaderboardInput,
    assets: AtomicAsset<MinigToolData>[]
  ): Promise<Result<void>> {
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
    } = input;

    let dailyUpdate: Result;
    const userDailySearch = await this.dailyLeaderboardRepository.findUser(
      username,
      walletId,
      fromDayStart,
      toDayEnd
    );

    if (userDailySearch.isFailure) {
      dailyUpdate = await this.dailyLeaderboardRepository.update(
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
      dailyUpdate = await this.dailyLeaderboardRepository.update(
        Leaderboard.cloneAndUpdate(dailyUserLeaderboard, input, assets)
      );
    }

    return dailyUpdate;
  }

  /*methods*/
}

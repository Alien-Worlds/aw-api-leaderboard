import { inject, injectable, Result, UpdateStatus, UseCase } from '@alien-worlds/api-core';
import { buildConfig } from '../../../../config';
import { LeaderboardEntry } from '../models/update-leaderboard.input';
import { LeaderboardInputRepository } from '../repositories/leaderboard-input.repository';
import { SendCachedLeaderboardUseCase } from './send-cached-leaderboard.use-case';

/*imports*/

const { updatesBatchSize } = buildConfig();

/**
 * @class
 */
@injectable()
export class CacheOrSendLeaderboardUseCase
  implements UseCase<UpdateStatus.Success | UpdateStatus.Failure>
{
  public static Token = 'CACHE_OR_SEND_LEADERBOARD_USE_CASE';

  constructor(
    @inject(LeaderboardInputRepository.Token)
    private leaderboardInputRepository: LeaderboardInputRepository,
    @inject(SendCachedLeaderboardUseCase.Token)
    private sendCachedLeaderboardUseCase: SendCachedLeaderboardUseCase
  ) {}

  /**
   * @async
   */
  public async execute(
    items: LeaderboardEntry[]
  ): Promise<Result<UpdateStatus.Success | UpdateStatus.Failure>> {
    const addResult = await this.leaderboardInputRepository.addMany(items);

    if (addResult.isFailure) {
      return Result.withFailure(addResult.failure);
    }

    const { content: count, failure: countFailure } =
      await this.leaderboardInputRepository.count();

    if (countFailure) {
      // ?
    }

    if (count >= updatesBatchSize) {
      return this.sendCachedLeaderboardUseCase.execute();
    }

    return Result.withContent(UpdateStatus.Success);
  }

  /*methods*/
}

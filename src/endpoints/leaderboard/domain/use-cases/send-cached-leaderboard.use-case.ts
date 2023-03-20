import {
  inject,
  injectable,
  Result,
  UpdateStatus,
  UseCase,
} from '@alien-worlds/api-core';
import { LeaderboardInputRepository } from '../repositories/leaderboard-input.repository';
import { UpdateLeaderboardUseCase } from './update-leaderboard.use-case';

/*imports*/

/**
 * @class
 */
@injectable()
export class SendCachedLeaderboardUseCase
  implements UseCase<UpdateStatus.Success | UpdateStatus.Failure>
{
  public static Token = 'SEND_CACHED_LEADERBOARD_USE_CASE';

  constructor(
    @inject(LeaderboardInputRepository.Token)
    private leaderboardInputRepository: LeaderboardInputRepository,
    @inject(UpdateLeaderboardUseCase.Token)
    private updateLeaderboardUseCase: UpdateLeaderboardUseCase
  ) {}

  /**
   * @async
   */
  public async execute(): Promise<Result<UpdateStatus.Success | UpdateStatus.Failure>> {
    const { content: allItems, failure: extractFailure } =
      await this.leaderboardInputRepository.extractAll();

    if (extractFailure) {
      // ?
    }

    return this.updateLeaderboardUseCase.execute(allItems);
  }

  /*methods*/
}

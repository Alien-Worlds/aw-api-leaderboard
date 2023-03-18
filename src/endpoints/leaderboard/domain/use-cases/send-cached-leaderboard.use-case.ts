import { inject, injectable, Result, UseCase } from '@alien-worlds/api-core';
import { LeaderboardInputRepository } from '../repositories/leaderboard-input.repository';
import { UpdateLeaderboardUseCase } from './update-leaderboard.use-case';

/*imports*/

/**
 * @class
 */
@injectable()
export class SendCachedLeaderboardUseCase implements UseCase<void> {
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
  public async execute(): Promise<Result<void>> {
    const { content: allItems, failure: extractFailure } =
      await this.leaderboardInputRepository.extractAll();

    if (extractFailure) {
      // ?
    }

    return this.updateLeaderboardUseCase.execute(allItems);
  }

  /*methods*/
}

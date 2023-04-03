import {
  inject,
  injectable,
  Result,
  UpdateStatus,
  UseCase,
} from '@alien-worlds/api-core';
import { LeaderboardUpdateBackupRepository } from '../repositories/leaderboard-update-backup.repository';
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
    @inject(LeaderboardUpdateBackupRepository.Token)
    private leaderboardInputRepository: LeaderboardUpdateBackupRepository,
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
      return Result.withFailure(extractFailure);
    }

    const { content: status, failure: updateFailure } =
      await this.updateLeaderboardUseCase.execute(allItems);

    if (updateFailure) {
      this.leaderboardInputRepository.addMany(allItems);

      return Result.withFailure(updateFailure);
    }

    return Result.withContent(status);
  }

  /*methods*/
}

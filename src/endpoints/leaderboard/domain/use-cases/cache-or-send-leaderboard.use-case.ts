import {
  inject,
  injectable,
  Result,
  UpdateStatus,
  UseCase,
} from '@alien-worlds/api-core';
import { buildConfig } from '../../../../config';
import { LeaderboardUpdate } from '../models/update-leaderboard.input';
import { LeaderboardUpdateBackupRepository } from '../repositories/leaderboard-update-backup.repository';
import { SendCachedLeaderboardUseCase } from './send-cached-leaderboard.use-case';

/*imports*/

const { checkAndUpdateBatchSize } = buildConfig();

/**
 * @class
 */
@injectable()
export class CacheOrSendLeaderboardUseCase
  implements UseCase<UpdateStatus.Success | UpdateStatus.Failure>
{
  public static Token = 'CACHE_OR_SEND_LEADERBOARD_USE_CASE';

  constructor(
    @inject(LeaderboardUpdateBackupRepository.Token)
    private leaderboardUpdateBackup: LeaderboardUpdateBackupRepository,
    @inject(SendCachedLeaderboardUseCase.Token)
    private sendCachedLeaderboardUseCase: SendCachedLeaderboardUseCase
  ) {}

  /**
   * @async
   */
  public async execute(
    items: LeaderboardUpdate[]
  ): Promise<Result<UpdateStatus.Success | UpdateStatus.Failure>> {
    const addResult = await this.leaderboardUpdateBackup.addMany(items);

    if (addResult.isFailure) {
      return Result.withFailure(addResult.failure);
    }

    const { content: count, failure: countFailure } =
      await this.leaderboardUpdateBackup.count();

    if (countFailure) {
      // ?
    }

    if (count >= checkAndUpdateBatchSize) {
      return this.sendCachedLeaderboardUseCase.execute();
    }

    return Result.withContent(UpdateStatus.Success);
  }

  /*methods*/
}

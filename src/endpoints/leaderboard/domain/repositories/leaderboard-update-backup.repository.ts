import { injectable, Result } from '@alien-worlds/api-core';
import { LeaderboardUpdate } from '../models/update-leaderboard.input';

/**
 * @abstract
 * @class
 */
@injectable()
export abstract class LeaderboardUpdateBackupRepository {
  public static Token = 'LEADERBOARD_UPDATE_BACKUP_REPOSITORY';

  public abstract addMany(items: LeaderboardUpdate[]): Promise<Result>;
  public abstract extractAll(): Promise<Result<LeaderboardUpdate[]>>;
  public abstract count(): Promise<Result<number>>;
}

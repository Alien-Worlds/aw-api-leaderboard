import { injectable, Result } from '@alien-worlds/api-core';
import { LeaderboardEntry } from '../models/update-leaderboard.input';

/**
 * @abstract
 * @class
 */
@injectable()
export abstract class LeaderboardInputRepository {
  public static Token = 'LEADERBOARD_INPUT_REPOSITORY';

  public abstract addMany(items: LeaderboardEntry[]): Promise<Result>;
  public abstract extractAll(): Promise<Result<LeaderboardEntry[]>>;
  public abstract count(): Promise<Result<number>>;
}
